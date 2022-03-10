const path = require('path');
const express = require('express');
const app = express();
const os = require('os');
const Server = require('node-git-server');
var admin = require("firebase-admin");
const fs = require('fs');
var serviceAccount = require("./krios.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://krios-studio-default-rtdb.firebaseio.com/"
});
const db = admin.database();
const repos = new Server(path.resolve(__dirname, 'tmp'), {
  autoCreate: true
});

const port = 7005;

repos.on('push', (push) => {
push.accept();
var branch = push.branch;
var commit = push.commit;
var user = push.repo.split("/")[0];
var repo = push.repo.split("/")[1];
// db.ref(user).child(repo).child(branch).set({
// "latest-commit":commit,
// });
});

repos.on('fetch', (fetch)=>{
  fetch.accept();
});
app.use('/', function(req, res) {
repos.handle(req, res)
});
app.listen(port, () => {

});