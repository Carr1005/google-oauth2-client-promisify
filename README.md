## Synopsis
Redesigning the Node.js code on [document of google developers](https://developers.google.com/gmail/api/quickstart/nodejs) that describe the process for creating OAuth2 client and getting credentials. Wrapping it as a tiny module and hope to be a good starting point for anyone gonna handle google apis in promise-style.
## Installation
```
npm install google-oauth2-client-promisify
```

## How to
1. Make sure that client secrets (json file) was downloaded and moved into your working directory.
2. Install the **googleapis** module that allow you to deal with google api.
   ```npm install googleapis --save```
###exaple
