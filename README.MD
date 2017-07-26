# Watson Developer Labs
## Building a Watson chatbot that intuitively responds to how your customer feels!

![Servian Logo](/screenshots/servian_logo.png)

Built by Owen Smith from [Servian](servian.ai)

Powered by IBM Watson.


# Before you begin
All the instructions for this lab can be found digitally at github.com/CaffeineFusion/EmotionBot
It's suggested that you copy and paste from the Github rather than type the instructions in from the handout.

1. Sign up for a Bluemix account
    - [Sign up for Bluemix](https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson)

2. You'll need Cloud Foundry CLI, Git and Node
    - [Install Git](https://git-scm.com/book/en/v1/Getting-Started-Installing-Git)
    - [Install Cloud Foundry CLI](https://github.com/cloudfoundry/cli#downloads)
    - [Install Node and NPM](https://nodejs.org/#download)

# Overview
There are plenty of Bots that can handle basic conversation... but can we build a Bot that understands how the customer is feeling?

In this demo, we'll build a Conversation service that can respond to a customer's Emotions. We'll pick up the Emotions using Watson's Tone Analyser service and we'll deploy a prebuilt App that allows us to chain these together.

This is designed as a trainer led session.

# Setting up our Project
1. Clone the project

    `git clone https://github.com/CaffeineFusion/EmotionBot.git`

    [For Windows users - Do this from Git Bash]

2. Open the cloned folder

    `cd EmotionBot`

2. Log in to Cloud Foundry
    [For Windows users - Do this from your terminal. CF tools don't work from Git Bash]
    ```
    cf login
    ```
    This will ask for an API and your Bluemix credentials.
    If you set up your account for the Sydney datacenter, the api is api.au-syd.bluemix.net
    Use your Bluemix credentials to log in.

3. Create our basic Bluemix services

    ```
    cf create-service conversation free conversation-service
    cf create-service tone_analyzer lite tone-analyser-service
    ```

4. Create and Add Credentials into .env file

*[side note: . files [ie: .env.template and .env] by default won't appear in your standard navigation tools, such as windows explorer. They are invisible. Most text editors (Atom/Sublime/Notepad++/Notepad) will be able to see them, however. Alternatively you can go to the folder in a command line. For Windows type `start notepad {myfilename}`, for Unix/Mac `vim {myfilename}`]

    **Linux / Mac OSX**: `mv .env.template .env`

    **Windows**: `rem .env.template .env` *[You may want to open the .env.template in notepad and resave it as .env Important - When saving it, you must change the file type to "\*.\*" otherwise it will append .txt]*

    ```
    cf create-service-key conversation-service new-key
    cf service-key conversation-service new-key
    # copy these credentials into the .env file
    # BOT_USER={username}
    # BOT_PASS={password}

    cf create-service-key tone-analyser-service new-key
    cf service-key tone-analyser-service new-key
    # copy these credentials into the .env file
    # TONE_USER={username}
    # TONE_PASS={password}
    ```

5. Make our app name unique [*Linux* `vim manifest.yml`, *Windows* `start notepad manifest.yml`]
    `- name: emotion_bot` -> `- name: emotion_bot_{your_name}`

6. Deploy application
    ```
    cf push
    ```
    While our app is spinning up, move on to the next section [Building our Emotion Bot](#building-emotion-bot) and create the Workspace. Then come back to see the app when it finishes deploying.

7. Demonstrate base app https://{app_name}.au-syd.mybluemix.net

    *Note: App should open, but we haven't set up the Workspace yet. We need to create the Workspace and link in the ID before we can interact with a bot!*

<a name="building-emotion-bot"/>

# Building our Emotion Bot
## Importing our base Workspace
1. Navigate to your [Bluemix console](https://console.au-syd.bluemix.net/dashboard/services)

2. Under All Services, Click into the conversation-service.

    ![Conversation-Service](/screenshots/Conversation-Service.png)

3. Click "Launch Tool" to open the Conversation.

    ![Launch-Tool](/screenshots/Launch-Tool.png)

4. Click the Upload button.

    ![Upload-Workspace](/screenshots/Upload-Workspace.png)

5. Navigate to our project folder, select workspaces/workspace.json and import.

6. Add our Workspace ID to the App.
    - Click back to Workspaces

        ![Back-To-Workspaces](/screenshots/Back-To-Workspaces.png)

    - Click the details button on your new Workspace

        ![Workspace-Get-Details](/screenshots/Workspace-Get-Details.png)

    - Copy Workspace ID

        ![Workspace-Details](/screenshots/Workspace-Details.png)

    - Paste into the .env file

    - Run `cf push`

Congratulations! At this point we have now deployed a Bluemix App. This App is linked directly to our new Watson bot. Any changes to the Conversation Workspace will be reflected in our App immediately once Watson finishes retraining.

You can navigate to https://{app_name}.mybluemix.net in your web browser and have a very basic conversation with your new Bot.

    ![Chatting with the Bot](/screenshots/Chatting.png)

    (It recognises 3 intents: Greetings, Goodbye, and Support. If you ask for help with a specific Bluemix service, such as Single Sign On, Watson, Virtual Machines, or Docker it will pretend to activate that support service.)

Let's now dig into what these services can do, and set up our bot to respond to Emotion.

## Conversation Overview
Trainer will overview:
- Workspaces
- Intents
- Entities
- Dialog

## Responding to Tone
So here's what we want to do:
1. Customer says "I'm furious with you guys"
2. Tone Analyser detects Anger
3. Bot redirects customer to a staff member to have a personal conversation

### Detecting Tone - internal_modules/ToneAnalyser.js
Trainer will overview Tone Analyser service.
For an example that visualises real-time tone analysis, head to calldemo.servian.ai

#### Tone Analyser
Tone Analyser is a machine learning model that detects a customer's sentiment based on the words that they are using.
The service does not maintain a session - so the Tone measurement will correspond to only the text you have just sent to the service.

This means that, for short text snippets in a conversation, the results could be erratic. One sentence is positive, the next negative.
To get a better understanding of tone, you'll likely want to pass in conversation context as well. Rather than just passing in the last comment `("But the eggs were bad")`, you might pass in the last three
```
("The conference was fantastic. The speakers were great. But the eggs were bad.")
```
However, for the sake of this demo, we'll just pass in the last sentence.

#### Sentence and JSON analysis
Tone Analyser can also be used to parse more complex objects and sentence breakdowns. For this demo, we only want a simple analysis of the text we're passing to the API.
For more details, you can check out:
https://github.com/IBM-Bluemix-Docs/tone-analyzer/blob/master/getting-started.md

#### CURL
To see the raw output, if you have CURL installed, you can replace {username} and {password} below with your *tone-analyzer* credentials you created earlier and run the code in your terminal window.
```
curl --user "{username}":"{password}" \
--header "Content-Type: application/json" \
--data  "{\"text\": \"Hi Team, I know the times are difficult! Our sales have been disappointing for the past three quarters for our data analytics product suite. We have a competitive data analytics product suite in the industry. But we need to do our job selling it! \"}" \
"https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone?version=2017-07-17&sentences=false"
```

You'll see the the following output:
```
{
	"document_tone": {
		"tone_categories": [{
			"tones": [{
				"score": 0.069776,
				"tone_id": "anger",
				"tone_name": "Anger"
			}, {
				"score": 0.010281,
				"tone_id": "disgust",
				"tone_name": "Disgust"
			}, {
				"score": 0.238294,
				"tone_id": "fear",
				"tone_name": "Fear"
			}, {
				"score": 0.03581,
				"tone_id": "joy",
				"tone_name": "Joy"
			}, {
				"score": 0.448082,
				"tone_id": "sadness",
				"tone_name": "Sadness"
			}],
			"category_id": "emotion_tone",
			"category_name": "Emotion Tone"
		}, {
			"tones": [{
				"score": 0.72969,
				"tone_id": "analytical",
				"tone_name": "Analytical"
			}, {
				"score": 0.0,
				"tone_id": "confident",
				"tone_name": "Confident"
			}, {
				"score": 0.0,
				"tone_id": "tentative",
				"tone_name": "Tentative"
			}],
			"category_id": "language_tone",
			"category_name": "Language Tone"
		}, {
			"tones": [{
				"score": 0.05805,
				"tone_id": "openness_big5",
				"tone_name": "Openness"
			}, {
				"score": 0.510902,
				"tone_id": "conscientiousness_big5",
				"tone_name": "Conscientiousness"
			}, {
				"score": 0.584692,
				"tone_id": "extraversion_big5",
				"tone_name": "Extraversion"
			}, {
				"score": 0.102107,
				"tone_id": "agreeableness_big5",
				"tone_name": "Agreeableness"
			}, {
				"score": 0.858414,
				"tone_id": "emotional_range_big5",
				"tone_name": "Emotional Range"
			}],
			"category_id": "social_tone",
			"category_name": "Social Tone"
		}]
	}
}
```

### Explanation: Passing Custom Context Variables
So our base app can extract emotion from text input, but how can we leverage ToneAnalyser to get the Bot to respond to it? There are a number of different ways we could pass this data from our App to our Bot. The simplest is to pass in some additional context data:

      context:{emotion:{anger:0.9}}

We can then pick this up and use it in our Conversation Dialog Flow as a variable.

      $emotion.anger >= 0.8


### Redirecting the Call
1. Open back up the Workspace we just created in the Bluemix's Conversation panel.
2. Click through to the Dialog tab.
3. Create a new node under the "Anything Else" node, call it "Transfer to Team"
This will be our escape node. "Would you like me to transfer you to our team?"
4. Add a new child node under the "Support" node.

    ![Add Child Node](/screenshots/Add-Child-Node)

    - Add the condition $emotion.anger >= 0.5 [$variables are context variables]
    - Down the bottom, against 'And then' select "Jump to..." -> "Transfer to Team"

Voila. We have a basic bot that can detect the emotion of the person calling and respond appropriately. Go back to your web interface and "I need some help with Container Services". Now if you say something like "You stupid bot! That's not what I want. You suck", it will now ask if you'd like to be transferred to the team.

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

![Add Child Node](/screenshots/Add-Child-Node.png)

#### Child Node - \#Agree
- If bot recognises: \#Agree
- Then respond with: 'Putting you through right away!'

#### Child Node - \#Diagree
- If bot recognises: \#Disagree
- Then respond with: 'No worries, is there anything else I can help with then?'

*When we implement this in a solution, we add a custom parameter that is returned by the Node. This gets picked up by our API. We can then trigger the next service to dial out to Twilio, for example*


#### Node - Goodbye
We can also now tailor our messages to how the customer is feeling. Open the existing Goodbye node.

Watson allows us to create responses that are sent based on a condition.
1. Click "Add Another Response"

      ![Add Response](/screenshots/Add-Another-Response.png)

2. Click "Add Response Condition"

      ![Add Response Condition](/screenshots/Response-Condition.png)

3. We then Add the Response condition $emotion.joy >= 0.5
And our response is "Glad I could be of assistance! Have a fantastic day!"

4. Let's do the same for our Angry customer.
The condition will be $emotion.anger >= 0.5
And our response is "Sorry I couldn't be of more assistance, hope you have a good day."

5. **Important** - We now need to move the generic response to the bottom of the list to ensure that the other conditions are checked first. Click the up arrows on the Happy and Angry responses until they both are above the generic response.

## Analysis & Learning
Instructor will run you through the Improve area in Watson Conversation.

------
#### Notes

*For instructions on setting up the base Workspace we imported, please see FULLGUIDE.MD.*
