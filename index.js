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
let ref = db.ref('/');
const dirTree = require('directory-tree');

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
  
function replaceAll(str, find, replace) {
                var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                return str.replace(new RegExp(escapedFind, 'g'), replace);
              }
const convert = require('amrhextotext');
  var clone_link = "https://jk.adhvaithprasad.repl.co/git/" + push.repo;
  ref = db.ref('/'+push.repo + '/' + push.branch + '/'+push.commit);
      var folder = "./repos/"+push.repo;
  Git.Clone(clone_link, "./repos/"+push.repo)
  .then(function(){

    const filteredTree = dirTree('./repos/'+push.repo, {attributes:['type']});


const hextree = JSON.stringify(filteredTree);
var reponame = replaceAll(push.repo,".","--dot--")
ref.child("treeview").child(reponame).set({
                treeview:hextree
              });

  })
    .then(function recursive() {

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
           
            }
            else {

              
              var kElement = replaceAll(element, "./repos/"+push.repo, "")
              var mElement = replaceAll(kElement, ".", "--dot--");

             
              var filevalue = convert.textToHex(fs.readFileSync(element).toString());
              ref.child("storage").child(mElement).set({
                value: filevalue
              });
              

            }

          })

        }
      });

    })
    



    .catch(err => {
      console.error(err);
    });




});

repos.on('fetch', (fetch)=>{
  fetch.accept();
})








var useragent = require('express-useragent');
 
app.use(useragent.express());
app.use('/', function(req, res) {
  if(req.useragent.browser === "git"){
    console.log("git")
repos.handle(req, res)
  }
  else{
    res.send('hi')
  }
});

app.listen(port, () => {
//
});