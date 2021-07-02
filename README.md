# ICME_repo
ICME - An Informed Consent Management Engine for Conformance in Smart Building Environments

we used Typescript 3.8.3 as the programming language and NodeJS  v14.3.0 as the application server to develop the prototype. Then, we integrated cloud MongoDB as our Document database and Mongoose for object modelling. We chose Amazon Web Services (AWS) as our infrastructure to deploy all API functions using AWS lambda service. We have exposed authorised accessibility to our written APIs via an AWS API gateway for consumers (Connected through a mobile app/ IoT automation Tool/ Voice Assistant or a collaboration platform for API development).  All the API calls are operated via Rest API. We have written three APIs (a) to trigger events of IoT devices; (b) to generate nudges and; (c) record user's privacy permission changes.

Link to IoT automation dashboard and reusable data flows on Node-RED:
https://bit.ly/3djWIox

Link to Mobile Application for digital privacy nudging:
https://github.com/chehara/NudgeMe

Learn how ICME works - https://youtu.be/5y6CdyWAdgY

# Pre-requisites for installation:
1. First, you need to have an AWS account and IAM role.
2. Then, configure your AWS account to your local machine using aws credentials. 
3. As we used an AWS Educate account the session get expired in every 30 mins. Thereby, you need to setup your own mqtt broker instead of using this private mqtt broker mqtts://a2p6styvdw6gnr-ats.iot.us-east-1.amazonaws.com:8883

# Steps for installation:
1. A dump of the MonGoDB document database can be arranged upon request and it should be imported to your Mongo DB account. 
2. Take a pull request of the ICM repo to your own machine, update it with new aws credentials/Mongoose DB models and deploy it using this command - 'yarn debug'.
3. Similarly, take a pull request of the NudgeMe mobile app repo and deploy it using this command - 'npn install'
4. Then install Node-RED/Dashboard to your machine (https://nodered.org/docs/getting-started/local) and download the Node-RED data flows json file from the above link.
5. Go to settings and import all the data flows on your Node-RED dashboard.
6. Find the MQTT node on the Node-RED flow diagram and update it with your AWS private/public access tokens
7. Deploy all the Node-RED flows and access the Node-RED dashboard for remote control.
8. Run your mobile emulator with a compatible device (e.g iPhone 12 Pro Max - 14.1)on your machine and you can use 'Expo Go' for quick setup.
9. Finally, you can control any device visualised on your dashboard remotely and any relevant nudge will be displayed on the debug window.
10. Similarly, for the demonstration purposes a single device can be controlled via the mobile app and you can view different types of nudges upon selecting the decline option/redirected to privacy setting options.  
 
