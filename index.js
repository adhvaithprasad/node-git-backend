const path = require('path');
const express = require('express');
const app = express();
const Server = require('node-git-server');
var admin = require("firebase-admin");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
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


const repos = new Server(path.resolve(__dirname, 'tmp'), {
  autoCreate: true
});
const glob = require("glob");
var getDirectories = function (src, callback) {
  glob(src + '/**/*', callback);
};
const port = 7005;
function replaceAll(str, find, replace) {
                var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                return str.replace(new RegExp(escapedFind, 'g'), replace);
}
  const storageRef = admin.storage().bucket(`gs://tribble-66bad.appspot.com`);
 async function uploadFile(path, filename) {
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `uploads/raw/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });


    return storage[0].metadata.mediaLink;
}

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
}

repos.on('push', (push) => {
push.accept();
const axios = require("axios");
  var url = "http://git.krios.studio/" + push.repo;
  var user = push.repo.split("/")[0];
  var name = push.repo.split("/")[1];
const options = {
  method: 'GET',
  url: 'https://api.krios.studio/clone_repo',
  params: {
    git_url: url,
    repo_name: name,
    user: user
  },
  headers: {'content-type': 'application/json'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
  
});



const cert = fs.readFileSync('./path/to/the/cert.crt');
const ca = fs.readFileSync('./path/to/the/ca.crt');
const key = fs.readFileSync('./path/to/the/private.key');



  
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
    fs.createReadStream('index.html').pipe(res)
  }
});

// (async() => {
//    const file = await uploadFile('./README.md', "README.md");
//    console.log(file);
// })();

  
app.listen(port, () => {
//
});