# PassRemind

VueJs with Vuetify and Firebase password manager app.
This project is intended to be used in a small scale environment
This web app, "webapp" folder, can work together with the browser extension from this author, that can be found in the "extension" folder
The "Billing" on the firebase must be enabled, due to the backup functionality, which is done every 5th day of the month, you can disable it by commenting the "dbBackup" function on the "/webapp/functions/index"

## Project setup
- Create a Firebase Project
- Configure Files
Edit Global.js.example(/extension) and firebaseConfig.js.example(/extension and /webapp)
Where Global.js will have a seed to generate the cryptograph key
firebaseConfig.js stores your firebase project setup data
then take out ".example"

You must have node and npm installed, first run the general setup, then choose if you rather set only the web app or both, the web app and plugin  

general setup
```
npm install -g @vue/cli
npm -g firebase-tools
```

plugin setup
```
cd extension
npm install
npm run build
```

web app
```
cd webapp
npm install
npm build
```

### deploy
To deploy the web app run

```
firebase deploy
```

it will deploy you app on the URL indicated by firebase, under the creation of the project

To deploy the plugin, the "extension/dist" folder must be uploaded following the link,
https://developer.chrome.com/extensions/getstarted#manifest under the "Create the Manifest" will teach you how to load you plugin
