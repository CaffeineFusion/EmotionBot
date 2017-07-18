# Watson Developer Labs
## Building a bot that can respond to how your customers feel

##### Contents
-----
###### Watson Conversation
- [Getting Started](#getting-started-conversation)
- [Building the Conversation Service](#building-conversation)

###### Tone Analyser
- [Getting Started](#getting-started-toneanalyser)

###### App
- [Building our App](#building-app)
- [Responding to Tone](#responding-to-tone)

<a name="geting-started-conversation"/>

## Getting started with Watson Conversation
Create Chatbot service
Chatbot High Level
- Intents - ML
- Entities
- Dialog

<a name="building-conversation"/>

## Building the Conversation Service
### Intents
### Entities
- Fuzzy Matching [Beta] - stemming etc.
- System Entities
### Dialog
- Slots
### Conversation
### Analysis
### CURL
```
curl -X POST --header 'Content-Type: application/json'  \
-u "{password}":"{username}" \
--header 'Accept: application/json'  -d '{}' \ 'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message?version=2017-07-17'
```

<a name="getting-started-toneanalyser" />

## Getting started with Tone Analyser
### Create Tone Analyser Service

### Tone Analyser
Tone Analyser is a machine learning model that detects a customer's sentiment based on the words that they are using.
The service does not maintain a session - so the Tone measurement will correspond to only the text you have just sent to the service.

This means that, for short text snippets in a conversation, the results could be erratic. One sentence is positive, the next negative.
To get a better understanding of tone, you'll likely want to pass in conversation context as well. Rather than just passing in the last comment `("the eggs were bad")`, you might pass in the last three
```
("The conference was fantastic
")
```

### CURL

<a name="building-app" />

## Building our App
Basic Node App [API -> Tone Analyser -> Watson]
Basic App Structure
------
```
server.js                           - Web Server
.env                                - Environment Variables
package.json                        - Our node package requirements
routes/index.js                     - Web Entry Point
internal_modules/Conversation.js    - Wrapper for Watson Conversation API
internal_modules/ToneAnalyser.js    - Wrapper for Watson Tone Analyser
```

Setup Environment Variables
------
```
.env
BOT_URL=https://gateway.watsonplatform.net/conversation/api
BOT_USER=
BOT_PASS=
BOT_WORKSPACE_ID=
BOT_API=v1
BOT_API_DATE=2017-07-17

TONE_URL=https://gateway.watsonplatform.net/tone-analyzer/api
TONE_USER=
TONE_PASS=
```

Local / Deploy App

<a name="responding-to-tone" />

## Responding to Tone
Tone Entities and Custom Commands
1. Customer says "I'm furious with you guys"
2. Tone Analyser detects Anger
3. Bot redirects customer to a staff member to have a personal conversation

### Detecting Tone - internal_modules/ToneAnalyser.js

### Passing Custom Context Variables
So our app can now extract emotion from text input, but how does the Bot respond to it? There are a number of different ways we could pass in this data. The simplest is to pass in some additional context data:

`context:{emotion:{anger:0.9}}`

We can then pick this up and use it in our Conversation Dialog Flow as a variable.

```
$emotion.anger >= 0.8
```

### Redirecting the Call
1. Create a new node under the "Welcome" node, call it "Transfer to Team"
This will be our escape node.
2. Add a new child node under the "Support" node.
    - Add the condition $emotion.anger >= 0.8 [$variables are context variables]
    - Down the bottom, against 'And then' select "Jump to..." -> "Transfer to Team"

Voila. We have a basic bot that can detect the emotion of the person calling and respond appropriately.





Chatbot Responding to Tone
