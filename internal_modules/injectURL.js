`use strict`

/**
 * Only for the purpose of the lab.
 * This file is run to replace the URL in our frontend with the current Environment variable.
 * Normally this is done by changing config.JSON and running gulp.
 * However, I didn't want attendees to worry about gulp or building the frontend.
 * Hence the prepacked frontend is in public, and we just update the url posthoc.
 **/

require('shelljs');
require('dotenv').config({silent:true});

var URL = process.env.application_uris[0];
shell.ls('../public/index.js').forEach(function (file) {
  shell.sed('-i', 'localhost:8080', URL, file);
});

process.exit();
