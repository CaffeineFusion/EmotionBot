# Watson Developer Labs
## Building a Watson chatbot that intuitively responds to how your customer feels!

![Servian Logo](/screenshots/servian_logo.png)

Built by Owen Smith from [Servian](servian.ai)

Powered by IBM Watson.


# Before you begin
1. Sign up for a Bluemix account
      - [Sign up for Bluemix](https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson)

2. You'll need Cloud Foundry CLI, Git and Node
      - [Install Git](https://git-scm.com/book/en/v1/Getting-Started-Installing-Git)
      - [Install Cloud Foundry CLI](https://github.com/cloudfoundry/cli#downloads)
      - [Install Node and NPM](https://nodejs.org/#download)

# Setting up our Project
1. Clone the project

      `git clone https://github.com/CaffeineFusion/EmotionBot.git`

2. Create our basic bluemix services
      ```
      cf login
      cf create-service conversation free conversation-service
      cf create-service tone_analyzer lite tone-analyser-service
      ```

3. Add Credentials into .env file
      ```
      mv .env.template .env

      cf create-service-key conversation-service new-key
      cf service-key conversation-service new-key
      # copy these credentials into the .env file

      cf create-service-key tone-analyser-service new-key
      cf service-key tone-analyser-service new-key
      # copy these credentials into the .env file
      ```

4. Make our app name unique [`vim manifest.yml`]
      `- name: emotion_bot` -> `- name: emotion_bot_{your_name}`

5. Deploy application
      ```
      cf push
      ```

6. Demonstrate base app {app_name}.au-syd.mybluemix.net


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

## Conversation Overview
- Intents
- Entities
- Dialog

## Responding to Tone
Hypothetical conversation flow:
1. Customer says "I'm furious with you guys"
2. Tone Analyser detects Anger
3. Bot redirects customer to a staff member to have a personal conversation

### Detecting Tone - internal_modules/ToneAnalyser.js

### Passing Custom Context Variables
So our base app can extract emotion from text input, but how can we leverage ToneAnalyser to get the Bot to respond to it? There are a number of different ways we could pass in this data. The simplest is to pass in some additional context data:

      context:{emotion:{anger:0.9}}

We can then pick this up and use it in our Conversation Dialog Flow as a variable.

      $emotion.anger >= 0.8


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

![Add Child Node](/screenshots/Add-Child-Node.png)

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

2. Click "Add Response Condition"

      ![Add Response Condition](/screenshots/Response-Condition.png)

3. We then Add the Response condition $emotion.joy >= 0.5
And our response is "Glad I could be of assistance! Have a fantastic day!"

4. Let's do the same for our Angry customer.
The condition will be $emotion.anger >= 0.5
And our response is "Sorry I couldn't be of more assistance, hope you have a good day."

5. **Important** - We now need to move the generic response to the bottom of the list to ensure that the other conditions are checked first. Click the up arrows on the Happy and Angry responses until they both are above the generic response.



*For instructions on setting up the base Workspace we imported, please see FULLGUIDE.MD.*
