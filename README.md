## For Git Flow and Deployment
- Make changes to the code on the dev branch
- Make sure that the correct secret.json object is loaded for the dev environment
- Push your completed code to Github on the dev branch
- Serverless deploy the code
- Test on the dev url (comfy-unicorn)

# Production
- When you are ready to update the code for the production url, go to Github and merge the dev branch into the main branch
- On your computer, pull the code from Github
- Make sure you are on the main branch
- Update the secrets.json to make sure you are using the object for the production environment
- Serverless deploy the code
- Test on the production URL (gallant-johnson)
