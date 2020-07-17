# PassRemind

VueJs with Vuetify and Firebase password manager app.
This project is intended to be used in a small scale environment, where some security issues weren't totally considered.
This web app can work together with the browser extension from this author, that can be found in this repository
```
https://github.com/Kojji/pass-remind-extension
```


## Project setup
 
```

npm install
npm -g firebase-tools

```
- Create Firebase Project
- Configure Files
Edit Global.js.example and firebaseConfig.js.example 
Global.js will have a key for the encryption
firebaseConfig.js stores your firebase project setup data
then take out ".example"

There are firebase functions on folder "functions", that can be used with
```
firebase deploy --only functions
``` 
But in order for them to work there must be configurations to be done that can be found in
```
https://blog.emad.in/automate-firestore-db-backups/
https://cloud.google.com/billing/docs/how-to/notify
```

### Compiles and hot-reloads for development

```

npm run serve

```

### Compiles and minifies for production

```

npm run build

```

### Deploy on Firebase

```

firebase deploy

```