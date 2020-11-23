const projectConfig = require("./firebaseConfig.js");
const seedKey = require("./global");
const admin = require('firebase-admin');
const functions = require('firebase-functions')
const backup = require('./backup')
const stopUsage = require('./capCost')
const crypto = require("crypto-js");

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
    let key = crypto.SHA256(context.auth.uid);
    let derivation = crypto.PBKDF2(key, seedKey, {
      keySize: 128 / 32
    });
    admin.firestore().collection("users").doc(context.auth.uid).collection('entries').get()
      .then( querySnapshot => {
        if(querySnapshot.docs.length > 0) {
          let entryArray = [];
          querySnapshot.forEach(item => {
            let entry = item.data();
            var decrypted = crypto.AES.decrypt(entry.password, derivation.toString());
            entry.password = decrypted.toString(crypto.enc.Utf8);
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
    let key = crypto.SHA256(context.auth.uid);
    let derivation = crypto.PBKDF2(key, seedKey, {
      keySize: 128 / 32
    });
    let encrypted = crypto.AES.encrypt(data.password, derivation.toString());
    data.password = encrypted.toString();
    admin.firestore().collection("users").doc(context.auth.uid).collection('entries').doc(data.service)
      .set(data).then(()=>{
        res({success: true})
        return 1;
      }).catch((err)=>{
        rej(err)
      })
  });
})

exports.updateDoc = functions.https.onCall((data, context)=>{
  return new Promise((res, rej) => {
    let key = crypto.SHA256(context.auth.uid);
    let derivation = crypto.PBKDF2(key, seedKey, {
      keySize: 128 / 32
    });
    let encrypted = crypto.AES.encrypt(data.new.password, derivation.toString());
    data.new.password = encrypted.toString();
    if(data.old.service.toUpperCase() !== data.new.service.toUpperCase()) {
      admin.firestore().collection('users').doc(context.auth.uid).collection('entries').doc(data.new.service)
        .set(data.new)
        .then(()=>{
          admin.firestore().collection('users').doc(context.auth.uid).collection('entries').doc(data.old.service)
            .delete().then(()=>{
              res({success: true})
              return 1;
            }).catch((err)=>{
              rej(err)
            })
          return 1;
        }).catch((err)=>{
          rej(err)
        })
    } else {
      admin.firestore().collection('users').doc(context.auth.uid).collection('entries').doc(data.new.service)
        .set(data.new)
        .then(()=>{
          res({success: true})
          return 1;
        }).catch(err => {
          rej(err)
        })
    }
  });
})
