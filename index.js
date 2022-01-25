const path = require('path');
const express = require('express');
const app = express();
const Server = require('node-git-server');
var admin = require("firebase-admin");
const fs = require('fs');
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
const glob = require("glob");
var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};
const port = 7005;

repos.on('push', (push) => {


  push.accept();
  

  console.log(push)

  var clone_link = "https://g.adhvaithprasad.repl.co/" + push.repo;
  Git.Clone(clone_link, "./repos")
    .then(function recursive() {

      var folder = "./repos";

      getDirectories(folder, function(err, res) {
        if (err) {
          console.log('Error', err);
        } else {

          res.forEach(element => {

            function isDir(path) {
              try {
                var stat = fs.lstatSync(path);
                return stat.isDirectory();
              } catch (e) {
                // lstatSync throws an error if path doesn't exist
                return false;
              }
            }

            var mnk = isDir(element);
            if (mnk === true) {
              // falsy
            console.log("false")
            }
            else {

              function replaceAll(str, find, replace) {
                var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                return str.replace(new RegExp(escapedFind, 'g'), replace);
              }
              var kElement = replaceAll(element, "./repos", push.repo)
              var mElement = replaceAll(kElement, ".", "--dot--");
              var filepath = fs.readFileSync(element);
              var filevalue = filepath.toString()
              ref.child("storage").child(mElement).set({
                value: filevalue
              });

            }

          })

        }
      });

    })
    .then(function info() {
      var commit = push.commit;
      var username = push.username;
      var repo = push.repo;
      var branch = push.branch;
      ref.child("repo-info").child(repo).set({
        user: username,
        commit: commit,
        branch: branch
      });



    })



    .catch(err => {
      console.error(err);
    });




});


app.use('/console', express.static(__dirname + '/console'));

app.use('/git', function(req, res) {
  repos.handle(req, res)
});

app.listen(port, () => {
  console.log(`Express http server listening`);
});