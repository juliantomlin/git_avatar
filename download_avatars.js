require('dotenv').config()

var owner = process.argv[2]
var repo = process.argv[3]

var request = require('request')
var token = require('./secrets')
var fs = require('fs')

var starObject = {}
var loops = 0

// var https = require('https')

console.log('welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback, starred) {


  var requestOptions = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName +'/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'BEARER ' + process.env.GITHUB_TOKEN
    }
  }

  request(requestOptions, function(err, res, body) {
    var output = JSON.parse(body)
    var starredLists = []
      for (user in output) {
        starredLists.push(output[user].starred_url.replace('{/owner}{/repo}', ''))
        callback(output[user].avatar_url, './avatar_pictures/' + output[user].login)
    }
    starred(starredLists)
  })
}


function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
          throw err;
         })
         .pipe(fs.createWriteStream(filePath))
}

var makeRepoList = function (listOfURL, callback) {
  listOfURL.forEach(function(repo) {
    var listOfUserStars = {
      url: repo,
      headers: {
      'User-Agent': 'request',
      'Authorization': 'BEARER ' + process.env.GITHUB_TOKEN
      }
    }
    callback(listOfUserStars, listOfURL)
  })
}

var makeObjectFromRepoList = function (starList, listOfURL){
  request(starList, function(err, res, body) {
    var list = JSON.parse(body)
    for (star in list) {
      if (starObject[list[star].html_url]) {
        starObject[list[star].html_url] += 1
      }
      else {
        starObject[list[star].html_url] = 1
      }
    }
    loops += 1
    if (loops === listOfURL.length){
      // console.log(starObject)
      var evaluate = []
        for (key in starObject){
          evaluate.push({'value': starObject[key], key: key})
        }
        evaluate.sort(function(a,b){
          return b.value - a.value
        })
        var output = evaluate.slice(0,5)
        console.log("top 5 repos: ")
        for (repo in output){
          console.log(`${output[repo].key} with ${output[repo].value} stars`)
        }
    }
  })
}




function recommend (urlList) {
  var arr = []
  var done = false
  var starList
  makeRepoList(urlList, makeObjectFromRepoList)
    // loops += 1
    // if (loops === urlList.length){
    //     evaluate = []
    //     for (key in starObject){
    //       evaluate.push({'value': starObject[key], key: key})
    //     }
    //     evaluate.sort(function(a,b){
    //       return a - b
    //     })
    //     console.log(evaluate)
    // }
}


if (!repo) {
  console.log ('please include owener and repo name')
}
else if (process.argv[4]) {
  console.log ('please only enter in the owner and repo names')
}
else if (!fs.existsSync('./avatar_pictures/')) {
  console.log ('make sure ./avatar_pictures/ file exists in root directory')
}
else if (!fs.existsSync('./.env')) {
  console.log ('error: missing ".env" file')
}
else if (!process.env.GITHUB_TOKEN) {
  console.log ('GITHUB_TOKEN missing from ".env" file')
}
else if (process.env.GITHUB_TOKEN.length !== 40){
  console.log ('please use a valid personal access token for GITHUB_TOKEN')
}
else {
  getRepoContributors(owner, repo, downloadImageByURL, recommend)
  console.log('download successful')
}
