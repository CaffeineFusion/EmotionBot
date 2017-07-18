'use strict';

/**
 * Watson wrapper built by Owen Smith and Servian AI.
 * https://www.linkedin.com/in/oclsmith/
 * servian.ai
 *
 * This code provides a basic wrapper around the Watson Developer Cloud Conversation Service.
 * It is written for Node in ES6. The Conversation module is a Class.
 * Promises are used, but error handling has not yet been built into this module.
 **/

const Watson    = require('watson-developer-cloud/conversation/v1');

const DEFAULT_CONTEXT_SETTINGS = {
    "system": {"dialog_stack": [{"dialog_node":"root"}],
        "dialog_turn_counter": 1,
        "dialog_request_counter": 1}
};


// Internal Helper Functions
/**
 * Construct payload and send message to Watson Conversation connection.
 * @param  {Watson} Connection  Watson Connection object. Must have a message(json, function) function.
 * @param  {string} workspaceID ID for Conversation Workspace.
 * @param  {JSON}   context     Conversation Context object. Overridden if input text is null.
 * @param  {string} input       Message to be sent.
 * @return {Promise}            Returns a ES6 Promise object that resolves with an Error or a JSON response.
 */
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


/**
 * Transform Conversation output to desired JSON format
 * @param  {JSON}   response Raw Conversation Output
 * @return {Promise}         Returns a Promise object that resolves to a formatted JSON object
 *
 * Currently just a dummy function.
 */
function transformResponse(response) {
    return new Promise(function(resolve, reject) {
        console.log(response);
        resolve(response);
    });
}

module.exports = class Conversation {

    /**
     * Constructs the Conversation object.
     * @param  {JSON} config        Configuration variables { username: x, password: y,
     *                              version_date: z, version: a, url: b }
     */
    constructor(config) {
        this.Connection = new Watson({
            url: config.url,
            version_date: config.version_date,
            version: config.version,
            username: config.username,
            password: config.password,
            //headers: { "X-Watson-Learning-Opt-Out": "1" } //If we don't want our input logged.
        });
        this.workspaceID = config.workspace_id;
        this.contexts = {};
        this.transformation = transformResponse;
    }

    /**
     * Sends a Message to the Watson Conversation API.
     * Replicates curl -X POST --header 'Content-Type: application/json'  -u "{password}":"{user}" --header 'Accept: application/json'  -d "{\"input\": {\"text\": \"What is an RDD?\"}, \"context\": {\"conversation_id\": \"d93d5355-6195-4be5-b429-79e59182a75b\", \"system\": {\"dialog_stack\": [\"root\"], \"dialog_turn_counter\": 1, \"dialog_request_counter\": 1}}}" "https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message?version={version_date}"
     * @param  {string} conversationID      Nullable. ID for the Conversation session.
     * @param  {string} message             Nullable. Message to be POSTed to the Conversation instance.
     * @param  {string} sessionID           Nullable. SessionID of HTTP connection. Currently unused.
     * @param  {JSON}   additionalContext   Nullable. Contains any additional context to pass to Watson.
     * @return {Promise}                    Returns an ES6 Promise that Resolves to a JSON object.
     */
    sendMessage(conversationID, message, sessionID, additionalContext) {
        var self = this;
        return new Promise(function(resolve, reject) {

            // Create Payload
            var context = DEFAULT_CONTEXT_SETTINGS;
            if(conversationID !== null) {
                console.log('=== Grabbing existing context ===')
                context.conversation_id = conversationID;
                if(self.contexts[conversationID] !== undefined) context = self.contexts[conversationID];
            }
            var input = {"text" : message };

            if(additionalContext !== null) {
                for(let name in additionalContext) {
                    context[name] = additionalContext[name];
                    console.log(additionalContext, context);
                }
            }


            console.log('=== Context :', context, context.system.dialog_stack, ' ===');
            console.log('=== Input :', input, ' ===');

            //1. Send Message to Conversation API
            sendPayload(self.Connection, self.workspaceID, context, input)

                //2. Store Conversation context if this is a new conversation.
                .then(response => {
                    if(response.context.conversation_id !== null) self.contexts[response.context.conversation_id] = response.context;
                    console.log('+++++ New Context --- ', conversationID, response.context, ' +++++');
                    return(response);
                })

                //3. Transform the output to our desired format.
                .then(response => self.transformation(response))

                //4. Pass back our JSON object.
                .then(result => {
                    //contexts[conversationID] = result.context;
                    console.log("=== Result : ", JSON.stringify(result), " ===");
                    resolve(result);
                })

                .catch(err => { console.log(err, input, context); reject(err); });

        });

    }
};
