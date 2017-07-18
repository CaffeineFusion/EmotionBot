`use strict`;

var express = require('express');
var router = express.Router();

require('dotenv').config({silent:true});

// Load internal dependencies
var ToneAnalyser = require('../internal_modules/ToneAnalyser.js');

// Create and configure Watson services
const toneConfig = {
    username: process.env.TONE_USER,
    password: process.env.TONE_PASS,
    version_date: process.env.TONE_API_DATE
};
var toneAnalyser = new ToneAnalyser(toneConfig);


// Routes
router.use(function(req, res, next){
    console.log(req.sessionID);
    next();
});

/**
 * POST api/v1/emotion - Passes a message through ToneAnalyser
 * @param {JSON}      req.body takes a json object of form {text:x}
 * @return {JSON}     returns a json object of form {emotion:{anger:x, ...}, social:{openness_big5:y, ...}}
 */
router.post('/', function(req, res) {
    let text = req.body.text;

    console.log('====================================');
    console.log('New Message Received', text);
    console.log('====================================');


    if(text === undefined || text === null) {
        res.status(400).send({ success: false, err: 'No text given!'});
        return;
    }

    toneAnalyser.analyse(text)
        .then(result => res.json(result))
        .catch(error => res.status(400).send({ success: false, err: error}));
});

module.exports = router;
