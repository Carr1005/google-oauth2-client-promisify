# google-oauth2-client-promisify
Redesign the Node.js code in [document on google developers](https://developers.google.com/gmail/api/quickstart/nodejs) that describe the process for creating OAuth2 client and getting credentials. Wrap it as a tiny module and hope to be a good starting point for anyone gonna handle Google APIs in futher with promise-style.

## Installation
```
npm install google-oauth2-client-promisify
```

## Example - calling the Gmail API

### Note:
- Make sure that client secrets (json file) was downloaded and moved into your working directory.
- ```npm install googleapis --save``` that allow you to deal with google api.

```js
var oauth2Client = require('google-oauth2-client-promisify');
var google = require('googleapis');
var gmail = google.gmail('v1');

/**
* CLIENT_SECRET_FILE: Path of your client secret file.
* TOKEN_FILE: Just give a name you like for the json file which store token.
* SCOPES: Decide what kind of permission would be authorized. 
* More details in -> https://developers.google.com/gmail/api/auth/scopes
*/

var CLIENT_SECRET_FILE = 'client_secret_blablabla.json';
var TOKEN_FILE = 'gmail-nodejs-collect-mails.json';
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];

oauth2Client.createOauth2Client(CLIENT_SECRET_FILE,SCOPES,TOKEN_FILE)
	.then( auth => {
		gmail.users.messages.list({
				auth: auth
				,userId: 'me'
				,maxResults: '500'
			}, (err, response) => {
				if (err) 
					throw err;
				else
					console.log(response.messages);
		});
	})
	.catch( err => {
		console.log(err);
	});

```
