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
Intents
Entities
- Fuzzy Matching [Beta] - stemming etc.
- System Entities
Dialog
- Slots
Conversation
Analysis
CURL

<a name="getting-started-toneanalyser" />

## Getting started with Tone Analyser
Create Tone Analyser Service

Tone Analyser
CURL

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



Chatbot Responding to Tone
