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

  // https.get(requestOptions.url, function(response) {
  //   response.setEncoding('utf8')
  //   data = ''
  //   response.on('data', function (chunk) {
  //     data += chunk
  //   })

  //   response.on('end', function() {
  //     callback(data.avatar_url)
  //   })
  // })
}

// getRepoContributors('jquery', 'jquery', function(err, result) {
//   console.log("Errors: ", err)
//   console.log("Result: ", result)
// })

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
          throw err;
         })
         .pipe(fs.createWriteStream(filePath))
}

getRepoContributors('jquery', 'jquery', downloadImageByURL)
