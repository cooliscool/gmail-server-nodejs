const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

var L = console.log;

var master = {
  funcs: {},
  auth:{}
};


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 
'https://www.googleapis.com/auth/gmail.modify',
'https://www.googleapis.com/auth/gmail.compose',
'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), (auth) =>{
    master.auth = auth;
    // master.funcs.list();
  });
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
master.funcs.list = function listLabels( callback) {
  // var labls = '';
  if(!master.auth) return console.log("login first");
  var auth = master.auth;
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      return callback(labels);
    } else {
      console.log('No labels found.');
    }
  });

  // return labls;
}


/**
 * Send Message.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
master.funcs.send = function sendMessage(to, from, body, callback) {
  // Using the js-base64 library for encoding:
  // https://www.npmjs.com/package/js-base64

  var base64EncodedEmail = makeBody(to, from,'passwd reset' ,body );

  if(!master.auth) return console.log("login first");
  var auth = master.auth;
  const gmail = google.gmail({version: 'v1', auth});

  // var base64EncodedEmail = Base64.encodeURI(email);

  gmail.users.messages.send({
    'userId': 'me',
    'resource': {
      'raw': base64EncodedEmail
    }
  }, (err, res)=>{
      if(err){
       // this is shady, do nothing
      } 

      if(res.status != 200){
        return callback("error in tha gmail api");
      }

      L(" res after sending the mail ");
      L(res.data); // contains details about the mail - unique ID and blah blah
      return callback(null, "mail sent successfully");
      
  });
  
}



function makeBody(to, from, subject, message) {

  var str = 
  "From: " + from + "\r\n" +
  "To: " + to + "\r\n" +
  "Subject: " +subject + "\r\n\r\n" +
  message;

  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}



module.exports  = master;