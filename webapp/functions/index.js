const functions = require('firebase-functions')
const backup = require('./backup')
const stopUsage = require('./capCost')

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