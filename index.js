const path = require('path');
const express = require('express');
const app = express();
const Server = require('node-git-server');
var admin = require("firebase-admin");
const { exec } = require('child_process');
var serviceAccount = require("./tribble.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tribble-66bad-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "gs://tribble-66bad.appspot.com"
});
var Git = require("nodegit");
const { getDatabase } = require('firebase-admin/database');

const db = getDatabase();
var ref = db.ref('/');
const __dirname = path.resolve();

const repos = new Server(path.resolve(__dirname, 'tmp'), {
    autoCreate: true
});

const port = 7005;

app.use('/console', express.static(__dirname + '/console'));

app.use('/git', function(req, res) {
  repos.handle(req, res)
});

app.listen(port, () => {
  console.log(`Express http server listening`);
});