'use strict';

const Watson    = require('watson-developer-cloud/conversation/v1');
//const config    = require(__dirname + '/../config.json');
//var importWebsite = require('../internal_modules/import_website.js');
const DEFAULT_CONTEXT_SETTINGS = {
    "system": {"dialog_stack": [{"dialog_node":"root"}],
        "dialog_turn_counter": 1,
        "dialog_request_counter": 1}
};


// Internal Helper Functions
function sendPayload(Connection, workspaceID, context, input) {
    return new Promise(function(resolve, reject) {
        var payload = {
            workspace_id: workspaceID,
            context: context,
            input: input,
        };
        if(input.text === null) {
            payload.input = {};
            payload.context = {};
        }

        Connection.message(payload, function(err, res) {
            if(err) {
                console.log(err);
                reject(err);
                return;
            }
            else {
                console.log("Watson Response:" + JSON.stringify(res));
                resolve(res);
            }
        });
    });
}


function transformResponse(response) {
    return new Promise(function(resolve, reject) {
        console.log(response);
        resolve(response);
    });
}


module.exports = class Conversation {
    // {  }
    constructor(config) {
        this.Connection = new Watson({
            url: config.Credentials.API,
            version_date: config.APIVersionDate,
            version: config.APITVersion,
            username: config.Credentials.UserName,
            password: config.Credentials.Password,
            headers: { "X-Watson-Learning-Opt-Out": "1" }
        });
        this.workspaceID = config.WorkspaceID;
        this.contexts = {};
        this.transformation = transformResponse;
    }

    setCustomTransformation(transformation) {
        this.transformation = transformation;
    }

    //curl -X POST --header 'Content-Type: application/json'  -u "f90fafde-9b41-4920-9c00-42674a7fcc2d":"0rW1ZuKAY7mV" --header 'Accept: application/json'  -d '{}' 'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/1466f2d2-d215-4423-b3e5-01a08eaab9a1/message?version=2016-09-20'
    getConversationID() {
        var self = this;
        return new Promise(function(resolve, reject) {

            sendPayload(self.Connection, self.workspaceID, {}, {})
                .then(res => resolve(res.context.conversation_id))
                .catch(reject);
        });
    }

    //curl -X POST --header 'Content-Type: application/json'  -u "f90fafde-9b41-4920-9c00-42674a7fcc2d":"0rW1ZuKAY7mV" --header 'Accept: application/json'  -d "{\"input\": {\"text\": \"What is an RDD?\"}, \"context\": {\"conversation_id\": \"d93d5355-6195-4be5-b429-79e59182a75b\", \"system\": {\"dialog_stack\": [\"root\"], \"dialog_turn_counter\": 1, \"dialog_request_counter\": 1}}}" "https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/1466f2d2-d215-4423-b3e5-01a08eaab9a1/message?version=2016-09-20"
    sendMessage(conversationID, message, sessionID) {
        var self = this;
        return new Promise(function(resolve, reject) {
            // Create Payload
            var context = DEFAULT_CONTEXT_SETTINGS;
            if(conversationID !== null) {
                console.log('=== Grabbing existing context ===')
                context.conversation_id = conversationID;
                if(self.contexts[conversationID] !== undefined) context = self.contexts[conversationID];
            }

            //var context = { "conversation_id" : conversationID, "system" : contextSettings.system };
            var input = {"text" : message };

            console.log('=== Context :', context, context.system.dialog_stack, ' ===');
            console.log('=== Input :', input, ' ===');

            sendPayload(self.Connection, self.workspaceID, context, input)
                .then(function(response) {
                    if(response.context.conversation_id !== null) self.contexts[response.context.conversation_id] = response.context;
                    console.log('+++++ New Context --- ', conversationID, response.context, ' +++++');
                    return(response);
                })
                .then(response => self.transformation(response))
                //.then(resolve)
                .then(function(result) {
                    //contexts[conversationID] = result.context;
                    console.log("=== Result : ", JSON.stringify(result), " ===");
                    resolve(result);
                })
                .catch(err => { console.log(err, input, context); reject(err); });

        });

    }
};
