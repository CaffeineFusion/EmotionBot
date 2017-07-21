## Before you begin
1. Set up Bluemix account
- [Sign up for Bluemix] (https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson)

2. Install Prereqs (Cloud Foundry, Git, NPM)
- [Install Git] (https://git-scm.com/book/en/v1/Getting-Started-Installing-Git)
- [Install Cloud Foundry CLI]
(https://github.com/cloudfoundry/cli#downloads)
- [Install Node and NPM]
(https://nodejs.org/#download)

## Setting up our Project
3. Clone project to machine
`git clone https://github.com/CaffeineFusion/EmotionBot.git`

4. Create necessary services
```
cf login
cf create-service conversation free conversation-service
cf create-service tone_analyzer lite tone-analyser-service
```

5. Add Credentials into .env file
```
mv .env.template .env

cf create-service-key conversation-service new-key
cf service-key conversation-service new-key
# copy these credentials into the .env file

cf create-service-key tone-analyser-service new-key
cf service-key tone-analyser-service new-key
# copy these credentials into the .env file
```

6. Change app name
`vim manifest.yml`

5. Deploy application
```
cf push
```

6. Demonstrate base app {app_name}.au-syd.mybluemix.net

- App Design

## Building our Emotion Bot
7. Import base Workspace
      1. Navigate to your [Bluemix console](https://console.au-syd.bluemix.net/dashboard/services)
      2. Under All Services, Click into the conversation-service.
      ![Conversation-Service](/screenshots/Conversation-Service.png)
      3. Click "Launch Tool" to open the Conversation.
      ![Launch-Tool](/screenshots/Launch-Tool.png)
      4. Click the Upload button.
      ![Upload-Workspace](/screenshots/Upload-Workspace.png)
      5. Navigate to our project folder, select workspaces/workspace.json and import.

8. Adding emotion awareness

9.
