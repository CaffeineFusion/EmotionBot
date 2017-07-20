# Watson Developer Labs
## Building a bot that can respond to how your customers feel

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/CaffeineFusion/EmotionBot.git)


##### Todo
- Basic UI
- YAML file for spinning up app
- Deployment Guide https://console.bluemix.net/docs/runtimes/nodejs/getting-started.html#getting-started-with-node-js-on-bluemix
- Finish Auto-Deployment script
- Set up demo so that users can navigate the code in Bluemix if they don't have node installed.
- Export and Upload Postman config

##### Contents
-----
###### Requirements

###### Watson Conversation
- [Getting Started](#getting-started-conversation)
- [Building the Conversation Service](#building-conversation)

###### Tone Analyser
- [Getting Started](#getting-started-toneanalyser)

###### App
- [Building our App](#building-app)
- [Responding to Tone](#responding-to-tone)

-------

<a name="requirements"/>

## Requirements
1. Bluemix Account
2. Node and npm (to run the application locally)
3. CURL or Postman (so that we can test basic REST requests)

Our app can be set up using Watson free tier services.
Components:
- Conversation Lite
- ToneAnalyzer Lite
- Node App

<a name="geting-started-conversation"/>

## Getting started with Watson Conversation
### Creating Chatbot service
1. Login to Bluemix

![Login to Bluemix](/screenshots/1-Initial.png)

2. Open Services -> Watson

![Services Menu](/screenshots/2-Services.png)
![Watson Screen](/screenshots/3-Watson-Screen.png)

3. Create Conversation Services

![Watson Services](/screenshots/4-Watson-Services.png)
![Conversation Configuration](/screenshots/5-Conversation-Config.png)

4. Note down API Credentials

![Conversation Management](/screenshots/6-Conversation-Manage.png)
![Conversation Credentials](/screenshots/7-Conversation-Service-Creds.png)


Chatbot High Level
- Intents - ML
- Entities
- Dialog

<a name="building-conversation"/>

## Building the Conversation Service
1. Login to Conversation Administration Panel

![Conversation Login](/screenshots/8-Conversation-Login.png)

2. Create Workspace

![Conversation Workspaces](/screenshots/9-Conversation-Workspaces.png)

3. Note down Workspace ID


### Intents
`Intents expanded on from IBM's DevZone Hands on Developer Lab:
https://ibm.ent.box.com/s/7ax67hlgvx5o7tn2wy6cqr8g0mnnbf5c/folder/20544200034`

#### Intent 1 - #Greeting
1. Hello, how are you doing today?
2. Hi
3. Good Afternoon
4. Good Evening
5. Good Morning
6. G'day
7. Sup?

#### Intent 2 - #Support
1. I’m looking for support on Watson Text to Speech Service
2. How can I get support on Watson Service
3. I am looking for support on Docker Container Service
4. I am looking for support on SSO
5. I need support on Object Storage Service
6. Support required on IBM Container Service

#### Intent 3 - #Goodbye
1. bye
2. bye and take care
3. goodbye!
4. bugger off
5. goodbye for now
6. see you
7. talk you soon
8. so long and thanks for all the fish


### Entities
- Fuzzy Matching [Beta] - stemming etc.
- System Entities

#### Entity 1 - \@Bluemix
- docker - Container, Container Image, Docker
- dev-ops - IBM Dev-Ops, DevOps, dev-ops
- sso - Single Sign On, SSO
- virtualmachine - Vitual Server, VM, Virtual machine
- watson - Watson, Watson Services

### Dialog
- Slots
- Evaluation logic of Dialog structure

#### Dialog Node - Welcome
The Welcome node is the node received before a user says anything. Let's change the node to:
- If bot recognises: welcome
- Then respond with: Welcome to Bluemix support, how can I help you?

#### Dialog Node - Anything else
The Anything Else node is our catch all let's leave this as is.

**Important Note** - Anything below an "anything_else" node can only be reached by a explicit goto statement. In evaluating conversation flow, Watson looks first at children of the current node. If it can't find an appropriate node, it then looks at the highest level nodes one by one.
This is quite useful when you have a node you want to reuse several times. We'll come back to this.

#### Dialog Node 1 - Support
Let's say our bot has the capability to activate support features for Bluemix. When our user speaks to the bot, we need to detect that they are speaking about #Support, and then respond by activate the appropriate support feature. Our support feature corresponds to the /@bluemix entity we created.

1. Click the 3 dots next to the Welcome node and select "Add node below"
![Add Node](/screenshots/Add Node.png)

2. We need to fill the node in as follows -
- If bot recognises: #Support
- Then respond with: I am enabling support for /@bluemix

#### Dialog Node 2 - Goodbye
Let's also add a final farewell node.
1. Click the 3 dots next to the Support node and select "Add node below"
![Add Node](/screenshots/Add Node.png)

- If bot recognises: #Goodbye
- Then respond with: Have a nice day.

### Conversation
### Analysis
### CURL
```
curl -X POST --header 'Content-Type: application/json'  \
-u {username}:{password} \
--header 'Accept: application/json'  -d '{}' \
'https://watson-api-explorer.mybluemix.net/conversation/api/v1/workspaces/{workspace_id}/message?version=2017-07-17'
```

<a name="getting-started-toneanalyser" />

## Getting started with Tone Analyser
### Create Tone Analyser Service

### Tone Analyser
Tone Analyser is a machine learning model that detects a customer's sentiment based on the words that they are using.
The service does not maintain a session - so the Tone measurement will correspond to only the text you have just sent to the service.

This means that, for short text snippets in a conversation, the results could be erratic. One sentence is positive, the next negative.
To get a better understanding of tone, you'll likely want to pass in conversation context as well. Rather than just passing in the last comment `("But the eggs were bad")`, you might pass in the last three
```
("The conference was fantastic. The speakers were great. But the eggs were bad.")
```


#### Sentence and JSON analysis
Tone Analyser can also be used to parse more complex objects and sentence breakdowns. For this demo, we only want a simple analysis of the text we're passing to the API.
For more details, you can check out:
https://github.com/IBM-Bluemix-Docs/tone-analyzer/blob/master/getting-started.md

### CURL
```
curl --user "{username}":"{password}" \
--header "Content-Type: application/json" \
--data  "{\"text\": \"Hi Team, I know the times are difficult! Our sales have been disappointing for the past three quarters for our data analytics product suite. We have a competitive data analytics product suite in the industry. But we need to do our job selling it! \"}" \
"https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-07-17&sentences=false"
```


<a name="building-app" />

## Building our App
Basic Node App [API -> Tone Analyser -> Watson]
### Basic App Structure
------
Within our App, we have an express web server (server.js), 1 main routing file (routes/index.js), 2 Watson API wrappers (internal_modules/ Conversation.js && ToneAnalyser.js) and an environment settings file (.env). package.json is our build file.
```
server.js                           - Web Server
.env                                - Environment Variables
package.json                        - Our node package requirements
routes/index.js                     - App Entry Point
routes/conversation.js              - Demo Route for just the Conversation API
routes/tone.js                      - Demo Route for just the Tone Analyser API
internal_modules/Conversation.js    - Wrapper for Watson Conversation API
internal_modules/ToneAnalyser.js    - Wrapper for Watson Tone Analyser
```

### Local build
-------
1. Install package.json: `npm install`
2. Setup Environment Variables: `vim .env`[see section below for .env template]
3. Run Demo: `node server.js`

### Setup Environment Variables
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
TONE_API=v1
TONE_API_DATE=2017-07-17

PORT=8080
```

### Testing
------
#### CURL local
```
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 029946e5-e5b7-a387-10c3-5de996a35e44" -d '{
	"text":"I need help with Watson",
	"chatID":""
}' "http://localhost:8080/api/v1/chat"
```

#### Postman Config



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
    - Add the condition $emotion.anger >= 0.5 [$variables are context variables]
    - Down the bottom, against 'And then' select "Jump to..." -> "Transfer to Team"

Voila. We have a basic bot that can detect the emotion of the person calling and respond appropriately.

Finally, let's detect their response.
Goto the intents tab and create two new Intents:

#### Intent 4 - #Agree
- Sure
- Thanks
- Right away please
- Yes please
- That would be fantastic
- Yep
- Okay

#### Intent 5 - #Disagree
- No
- That's not what I want
- Stop
- No Thanks
- Hell no
- That's wrong


Now let's go back into the Dialog flow. Under "Transfer to Team" add two child nodes:

#### Child Node - \@Agree
- If bot recognises: \@Agree
- Then respond with: 'Putting you through right away!'

#### Child Node - \@Diagree
- If bot recognises: \@Disagree
- Then respond with: 'No worries, is there anything else I can help with then?'


#### Node - Goodbye
We can also now tailor our messages to how the customer is feeling. Open the existing Goodbye node.

Watson allows us to create responses that are sent based on a condition.
1. Click "Add Another Response"
![Add Response](/screenshots/Add-Another-Response.png)

2. We then Add the Response condition
![Add Response Condition](/screenshots/Response-Condition.png)
$emotion.joy >= 0.5
And our response is "Glad I could be of assistance! Have a fantastic day!"

3. Let's do the same for our Angry customer.
The condition will be $emotion.anger >= 0.5
And our response is "Sorry I couldn't be of more assistance, hope you have a good day."

4. **Important** - We now need to move the generic response to the bottom of the list to ensure that the other conditions are checked first. Click the up arrows on the Happy and Angry responses until they both are above the generic response.




<a name="deploying-the-app" />

## Deploying our App

Local / Deploy App




Chatbot Responding to Tone
