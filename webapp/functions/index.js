const seedKey = require("./global");
const functions = require('firebase-functions')
const backup = require('./backup')
const stopUsage = require('./capCost')
const crypto = require("crypto-js");

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

// exports.stopUsage = functions.pubsub.topic('cap-cost').onPublish(async (message, context) => {
//   await stopUsage(message.attributes, context)
// })

exports.getPassEnc = functions.https.onCall((data, context)=>{
  return new Promise((res, rej) => {
    let key = crypto.SHA256(context.auth.uid);
    let derivation = crypto.PBKDF2(key, seedKey, {
      keySize: 128 / 32
    });
    res(derivation.toString());
  })
})
