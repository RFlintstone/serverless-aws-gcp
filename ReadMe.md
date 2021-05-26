# How to use and install this project

### Dependencies:
- This project
- Google/GCP CLI 
- Amazon/Lambda CLI
- Serverless CLI
- Node 10.* or above (12.16.0 was used to develop this project - default to that if other versions don't work)
- GCP Account with valid subscription
- Amazon Acount with valid subscription


### Installation:
1) Make a serverless account on https://serverless.com/.
2) Go to root folder of this project and run 'npm i --save' as well as download serverless globally on your pc.
See more about the setup instructions of serverless here: https://www.serverless.com/framework/docs/getting-started/
3) Download the CLI of Amazon (Lambda) and/or Google (GCP)'s website
4) Setup and login the CLI(s) of your choice
5) Login to serverless within the terminal (I recommend using PHPStorm or GIT Bash)

### Using Combined:
1) Once everything is installed properly choose the service you are going to use (Amazon/Lambda or Google/GCP). Depending on your choice you need to use another serverless.yml config file.
- serverless.dyn.yml for Amazon/Lambda
- (Default) serverless.yml for GCP
2) If you know where you want to deploy to go to config.js (located in the root of the project) and change "db_file" to
- dyn_db for Amazon/Lambda or
- gcp_db for Google/GCP

3) Now you setup the project it's time to create a database (both DynamoDB and DataStore are supported)
4) Once you created your database go back to config.js and change the value of "db_table" to the name of the Database you have just created
5) Last step, go into your terminal and run 'sls deploy' and it will create and deploy your API endpoint for you (if using AWS you need to add IAM permissions to be able to execute Database functions). 

### I want to create and deploy to a custom named function and organisation:
 
If you want to use another functions / names feel free to change the serverless.yml files. Once it's changed there it will automaticly configure the stuff for you
(As long as you created the project with the same name on your serverless dashboard)

How to configure serverless.yml: 
- Amazon: https://www.serverless.com/framework/docs/providers/aws/guide/functions/
- Google: https://www.serverless.com/framework/docs/providers/google/guide/functions/

