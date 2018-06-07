import https from 'http'
import axios from 'axios'
// import firebase from 'firebase'


export default function addLeadTracker(app) {
  // firebase.initializeApp({
  //   apiKey: "",
  //   authDomain: "",
  //   databaseURL: "",
  //   projectId: "",
  //   storageBucket: "",
  // });

  app.post('/leadtracker', (req, res, next) => {
    contact(req.body)
    // postToFirebase(req.body)
    res.send('done')
  })
}

/**
 * This function handles contact data
 * @async
 * @param {Object} message - The messgae to be sent
 * @param {string} message.subject - The Subject of the message
 * @param {string} message.email - The sending party's email
 * @param {string} message.text - The content of the message
 * @param {string} message.phone - The sending party's phone number
 */
function contact({
  text,
  subject,
  email,
  phone,
  timestamp,
}) {
  const url = process.env.SLACK_HOOK_URL

  return axios.post(url, {
    "attachments": [{
      "fallback": "New Lead From the Marketing Site",
      "pretext": "New Lead Alert! Someone contacted us on our site!",
      "title": subject,
      text,
      "fields": [
        {
          "title": "Email",
          "value": email,
          "short": true
        },
        {
          "title": "Number",
          "value": phone ? `<tel:${phone}|${phone}>` : 'None',
          "short": true
        }
      ],
      "ts": timestamp,
    }],
  })
}

// function postToFirebase(message) {
//   const contactRef = firebase.database().ref('contacts').push()
//   return contactRef.set(message)
// }