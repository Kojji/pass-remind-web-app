const projectConfig = require("./firebaseConfig.js");
const seedKey = require("./global");
const admin = require('firebase-admin');
const functions = require('firebase-functions')
const backup = require('./backup')
const stopUsage = require('./capCost')
var crypto = require("crypto-js");

admin.initializeApp(projectConfig);
// runs once a month
exports.dbBackup = functions.pubsub
  // change this to preferred frequency 
  .schedule('45 23 5 * *')
  // set it to whatever timezone you prefer
  .timeZone('Europe/Berlin')
  .onRun(async context => {
    try {
      await backup()
    } catch (err) {
      console.error('error running db backup cron', err)
    }
  })

exports.stopUsage = functions.pubsub.topic('cap-cost').onPublish(async (message, context) => {
  await stopUsage(message.attributes, context)
})

exports.readDoc = functions.https.onCall((data, context)=>{
  return new Promise((res, rej) => {
    let key = generateKey(context.auth.uid);
    admin.firestore().collection("users").doc(context.auth.uid).collection('entries').get()
      .then( querySnapshot => {
        if(querySnapshot.docs.length > 0) {
          let entryArray = [];
          querySnapshot.forEach(item => {
            let entry = item.data();
            //entry.password = crypto.AES.decrypt(entry.password,key);
            entryArray.push(entry);
          })
          res(entryArray);
        } else {
          res({});
        }
        return 1;
      }).catch((err)=>{
        rej(err);
      })
  });
})

exports.writeDoc = functions.https.onCall((data, context)=>{
  return new Promise((res, rej) => {
    //let key = generateKey(context.auth.uid);
    res(data)
    // admin.firestore().collection("users").doc(context.auth.uid).collection('entries').get()
    //   .then( querySnapshot => {
    //     if(querySnapshot.docs.length > 0) {
    //       let entryArray = [];
    //       querySnapshot.forEach(item => {
    //         let entry = item.data();
    //         entry.password = CryptoJS.AES.decrypt(entry.password,key);
    //         entryArray.push(entry);
    //       })
    //       res(entryArray);
    //     } else {
    //       res({});
    //     }
    //     return 1;
    //   }).catch((err)=>{
    //     rej(err);
    //   })
  });
})

exports.updateDoc = functions.https.onCall((data, context)=>{
  return new Promise((res, rej) => {
    //let key = generateKey(context.auth.uid);
    res(data)
    // admin.firestore().collection("users").doc(context.auth.uid).collection('entries').get()
    //   .then( querySnapshot => {
    //     if(querySnapshot.docs.length > 0) {
    //       let entryArray = [];
    //       querySnapshot.forEach(item => {
    //         let entry = item.data();
    //         entry.password = CryptoJS.AES.decrypt(entry.password,key);
    //         entryArray.push(entry);
    //       })
    //       res(entryArray);
    //     } else {
    //       res({});
    //     }
    //     return 1;
    //   }).catch((err)=>{
    //     rej(err);
    //   })
  });
})

function generateKey(passPhrase) {
  let key = crypto.SHA256(passPhrase);
  let derivation = crypto.PBKDF2(key, seedKey, {
    keySize: 128 / 32
  });
  return derivation.toString();
}