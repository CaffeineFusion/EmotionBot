`use strict`;

var express = require('express');
var router = express.Router();

require('dotenv').config({silent:true});

// Load internal dependencies
var Conversation = require('./internal_modules/Conversation.js');
var ToneAnalyser = require('./internal_modules/ToneAnalyser.js');

// Create and configure Watson services
const toneConfig = {
    username: process.env.TONE_USER,
    password: process.env.TONE_PASS,
    version_date: process.env.TONE_API_DATE
};
const conversationConfig = {
    url: process.env.BOT_URL,
    username: process.env.BOT_USER,
    password: process.env.BOT_PASS,
    version: process.env.BOT_API,
    version_date: process.env.BOT_API_DATE,
    workspace_id: process.env.BOT_WORKSPACE_ID
}
var conversation = new Conversation(conversationConfig);
var toneAnalyser = new ToneAnalyser(toneConfig);


router.use(function(req, res, next){
    console.log(req.sessionID);
    next();
});

/**
 * GET api/v1/chat - Starts a new Conversation session
 * @return {object}     returns a json object of form {}
 */
router.get('/chat', function(req, res) {
    let sessionID = req.sessionID;
    conversation.sendMessage(null, null, sessionID)
        //.then(bot.transform)
        .then(res => { console.log('==== get bot ID ====', res); return res;})
        .then(result => res.json(result))
        .catch(error => res.status(400).send({ success: false, err: error}));
});


/**
 * POST api/v1/chat - Sends a message to an existing Conversation session
 * @return {object}     returns a json object of form {}
 */
router.post('/chat', function(req, res) {
    let text = req.body.text;
    let chatID = req.body.chatID;
    let sessionID = req.sessionID;

    console.log('====================================');
    console.log('New Message Received', chatID);
    console.log('====================================');

    if(text === undefined || text === null) {
        res.status(400).send({ success: false, err: 'No text given!'});
        return;
    }
    conversation.sendMessage(chatID, text, sessionID)
    //    .then(bot.transform)
        .then(result => res.json(result))
        .catch(error => res.status(400).send({ success: false, err: error}));

});


module.exports = router;
