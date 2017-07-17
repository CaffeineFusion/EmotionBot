`use strict`;

// Load external dependencies
var express  = require('express');
var session  = require('express-session');
var helmet   = require('helmet');
var app      = express();
var path     = require('path');
var bodyParser = require('body-parser');

require('dotenv').config({silent:true});

// Require Routes
var index = require('./routes/index.js');

// Load middleware
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
    secret: 'integrate secrets here',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

// Load Routes
app.use('/api/v1', index);

app.get('*', function(req, res) {
    res.send(404);
});

//http.createServer(app);
// Launch Server
if(require.main === module) {
    app.listen(process.env.PORT, function(){
       console.log('Express listening on port ' + process.env.PORT);
    });
}
else exports.app = app;
