## Install

Inside the project directory run "npm install" or "yarn install"
<br>

## Scripts

In the project directory, you can run:

### `npm / yarn start`

Runs the app in the development mode.<br>

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
This version needs the development server running locally to work.


### `npm run / yarn startAlpha`

Runs the app with the Alpha env configuration.
The version has the apollo link configured to work with the alpha server.

### `npm run / yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
The build version is configured to work with the alpha server.

### `npm run / yarn analyze`
After building the project you can inspect the bundle source map packages sizes with this command.

### `npm run / yarn format`
Command to format all the files in the src folder with the prettier configuration.

## Project main libraries
- React
- Redux / Redux Thunk
- Apollo
- Material-ui
- Antd


## Project tools

Developed with VSCode with the following extensions.
- Language mode: JavaScript React (Babel),
- Import cost
- Prettier code formatter

## SOPS: Secrets OPerationS

This system supports files of type YAML, JSON, ENV, INI and BINARY. In the following link you can consult more information about the program https://github.com/mozilla/sops

To use the integration with Azure Key Vault it is necessary to authenticate with the necessary permissions to access the key vault "cbx-aks-keyvault". The commands to perform this action are:

- Access az account (https://docs.microsoft.com/en-us/cli/azure/authenticate-azure-cli):

$ az login

- List the subscriptions we can access (https://docs.microsoft.com/en-us/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription):

$ az account list --output table

- Select the subscription where our keyvault is located (https://docs.microsoft.com/en-us/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription):

$ az account set --subscription "$Suscripcion"


Once we have access to the keyvault, to encrypt a file you can do it in the following way:

$ sops --encrypt test.env > test.enc.env

And to decrypt it using:

$ sops --decrypt test.enc.env

## ESLINT: Linter tool

This code analysis tool will help us to identify problems in our code following previously defined rules and standards. For more information: https://eslint.org/

To use the tool we will need to install the dependencies defined below:

- eslint
- eslint-loader
- eslint-plugin-import

Airbnb rules will be used https://www.npmjs.com/package/eslint-config-airbnb with certain modifications found in the .eslintrc.js file

To launch the tool, use the following command:

$ yarn run eslint "$path-to-scan"
