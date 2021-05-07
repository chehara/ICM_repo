# ICME_repo
ICME - An Informed Consent Management Engine for Conformance in Smart Building Environments

we used Typescript 3.8.3 as the programming language and NodeJS  v14.3.0 as the application server to develop the prototype. Then, we integrated cloud MongoDB as our Document database and Mongoose for object modelling. We chose Amazon Web Services (AWS) as our infrastructure to deploy all API functions using AWS lambda service. We have exposed authorised accessibility to our written APIs via an AWS API gateway for consumers (Connected through a mobile app/ IoT automation Tool/ Voice Assistant or a collaboration platform for API development).  All the API calls are operated via Rest API. We have written three APIs (a) to trigger events of IoT devices; (b) to generate nudges and; (c) record user's privacy permission changes.

Link to IoT automation dashboard and reusable data flows on Node-RED:
https://bit.ly/3djWIox

Link to Mobile Application for digital privacy nudging:
https://github.com/chehara/NudgeMe

Learn how ICME works - https://youtu.be/5y6CdyWAdgY
