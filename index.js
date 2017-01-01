var fs = require('fs');
var readLine = require('readline');
var googleAuth = require('google-auth-library');
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';

function getClientSecretFile(clientSecretFile) {
	return new Promise( (resolve, reject) => {
		fs.readFile(clientSecretFile, (err, result) => {
			if (err) return reject('Error loading client secret file => ' + err);
			resolve(JSON.parse(result));
		});
	});
}

function getToken(oauth2Client, scopes, tokenFileName) {
	return new Promise( (resolve, reject) => {
		fs.readFile(TOKEN_DIR + tokenFileName, (err, token) => {
			if (err) {
				console.log('Need to get new token.');
				getNewToken(oauth2Client, scopes, tokenFileName)
					.then( oauth2Client => resolve(oauth2Client), reason => reject(reason));
			} else {
				oauth2Client.credentials = JSON.parse(token);
				resolve(oauth2Client);
			}
		});
	});
}

function getNewToken(oauth2Client, scopes, tokenFileName) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline'
		,scope: scopes
	});
	console.log('Authorize this app by visiting this url: \n', authUrl);
	var dialog = readLine.createInterface({
		input:  process.stdin
		,output: process.stdout
	});

	return new Promise( (resolve, reject) => {
		dialog.question('Enter the code from that page here: \n', code => {
			dialog.close();
			oauth2Client.getToken(code, (err, token) => {
				if (err) reject('Error while trying to retrieve access token => ' + err);
				else {
					oauth2Client.credentials = token;
					storeToken(token, tokenFileName);
					resolve(oauth2Client);
				}
			});
		});
	}); 
}

function storeToken(token, tokenFileName) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_DIR + tokenFileName, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_DIR + tokenFileName);
}

exports.getOauth2Client = (clientSecretFile, scopes, tokenFileName) => {
	return getClientSecretFile(clientSecretFile)
		.then( credentials => {
			console.log('[Success] => Get client secret file from local.');
			var clientSecret = credentials.installed.client_secret;
			var clientId = credentials.installed.client_id;
			var redirectUrl = credentials.installed.redirect_uris[0];
			var auth = new googleAuth();
			var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
			return getToken(oauth2Client, scopes, tokenFileName);
		})
		.then( oauth2Client => {
			console.log('[Success] => Build OAuth2Client.');
			return oauth2Client;
		})
		.catch( err => {
			throw err;
		});
}