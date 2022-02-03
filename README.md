Install cypress globally on your PC:npm i cypress

Clone automation repository from this URL: 

Let’s say it’s cloned to the Desktop inside of ‘NameName’ folder.

Open your terminal (cmd, gitbash…) and navigate inside councilbox-client folderexample:

Open cmd (C:\Users\Name>) - that’s the default opened folder

cd Desktop\NameName\councilbox-client

Once your are in that folder, you can use the following commands:

npm install cypress - Cypress install on your machinecypress open - Cypress UI should open and you can select the councilbox-client folder and run spec files like that

Running tests in headed mode:

npm run "smoke chrome" - Running every Smoke spec file in headed mode

npm run "regression chrome" - Running every Regression spec file in headed mode

Instead of chrome you can use 'electron, edge or firefox”

Running tests in headless mode:

npm run smoke - Running every Smoke spec file in headless mode

npm run regression - Running every Regression spec file in headless mode

After you complete on of those commands, cypress will create report in json and you can find that inside of Reports/mochareports folder, so next commands are for reports:npm run clean:reports - Delete all the reports from the Reports folder

npm run combine-reports - One json file will be created for each spec file, and this command is combining every json file into Onenpm run generate-report - Creating HTML report file from the json file

report.html file can be find inside of ‘Reports’ folder

If you are having any blockers, feel free to reach out to me on Slack.Alem QA

