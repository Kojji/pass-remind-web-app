/**
 * For the backup to work, make sure the following is done:
 *
 * - Set permission: https://console.cloud.google.com/iam-admin/iam
 *    `Datastore -> Cloud Datastore Import Export Admin`
 *    on the service account IAM role
 * - Set permission: https://console.cloud.google.com/storage/browser
 *    `Firebase Admin and Storage Admin`
 *    on the service account
 * - Create a bucket folder with the same name as
 *    the value of BACKUP_FOLDER variable
 */

const {GoogleAuth} = require('google-auth-library')
const projectConfig =  require("./firebaseConfig.js");
// process.env.FIREBASE_CONFIG is automatically populated in the
// cloud functions runtime, however we need to parse it, as a json string
const FIREBASE_CONFIG = projectConfig;
// the folder that was created in the default storage bucket
const BACKUP_FOLDER = 'backups'

module.exports = async function backup() {
  console.log('start firebase backup')

  const auth = new GoogleAuth({
    scopes: [
      'https://www.googleapis.com/auth/datastore',
      'https://www.googleapis.com/auth/cloud-platform',
    ],
  })
  const client = await auth.getClient()

  const {storageBucket, projectId} = FIREBASE_CONFIG
  const url = `https://firestore.googleapis.com/v1beta1/projects/${projectId}/databases/(default):exportDocuments`
  const backupFileName = new Date().toISOString()
  const backupUrl = `gs://${storageBucket}/${BACKUP_FOLDER}/${backupFileName}.json`

  await client.request({
    url,
    method: 'POST',
    data: {outputUriPrefix: backupUrl},
  })

  console.log('end firebase backup')
}