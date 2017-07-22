`use strict`;

// Load external dependencies
var express  = require('express');
var helmet   = require('helmet');
var app      = express();
var path     = require('path');
var bodyParser = require('body-parser');
var PORT = process.env.VCAP_APP_PORT || process.env.PORT || 3000;

require('dotenv').config({silent:true});

// Require Routes
var api = require('./routes/api.js');
var conversation = require('./routes/conversation.js');
var index = require('./routes/index.js');
var tone = require('./routes/tone.js');

// Load middleware
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


// Load Routes
app.use('/api/v1', api);                            // API
app.use('/api/v1/conversation', conversation);      // Conversation only
app.use('/api/v1/tone', tone);                      // Tone only
app.use('/', index);                                // Main app

app.get('*', function(req, res) {
    res.send(404);
});

// Launch Server
if(require.main === module) {
    app.listen(PORT, function(){
       console.log('Express listening on port ' + PORT);
    });
}
else exports.app = app;
