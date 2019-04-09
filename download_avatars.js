var owner = process.argv[2]
var repo = process.argv[3]

var request = require('request')
var token = require('./secrets')
var fs = require('fs')

console.log('welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {

  var https = require('https')

  var requestOptions = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName +'/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  }

  request(requestOptions, function(err, res, body) {
    var output = JSON.parse(body)
      for (user in output) {
        callback(output[user].avatar_url, './avatar_pictures/' + output[user].login)
    }
  })
}


function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
          throw err;
         })
         .pipe(fs.createWriteStream(filePath))
}
if (!repo){
  console.log ('please include owener and repo name')
}
else {
  getRepoContributors(owner, repo, downloadImageByURL)
  console.log('download successful')
}
