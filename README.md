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