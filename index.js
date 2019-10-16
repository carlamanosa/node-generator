const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "gituser",
      message: "What is your GitHub username?",
    },
  ])
}
async function gitHubInfo(username) {
  try {
    const queryUrl = `https://api.github.com/users/${username}`;
    const response = await axios.get(queryUrl)
    const user = response.data;
    const stars = await getStars(`${queryUrl}/starred`);
    const gituser = {
      name: user.name,
      company: user.company,
      blog: user.blog,
      bioImg: user.avatar_url,
      location: user.location,
      link: user.html_url,
      numRepos: user.public_repos,
      stars,
      followers: user.followers,
      following: user.following,
      email: user.email
    }
    console.log(gituser);
    return gituser;
  } catch (err) {
    console.log(err);
  }
}

function getStars(url) {
  return axios.get(url).then(response => response.data.map(({ name }) => name).length);
}


function generateHTML(gotGitHub) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid" style="background-color: #F5C1A1;">
  <div class="container">
  <div class="card" style="width: 18rem;margin: 0 auto;">
  <img class="card-img-top" src="${gotGitHub.bioImg}">
</div>
<br>
    <h1 class="display-4" style="text-align: center;color: #C16025;">Hi! My name is ${gotGitHub.name}</h1>
    <br>
    <p class="lead" style="text-align: center;color: #C16025;">I am from ${gotGitHub.location}.</p>
    <h3><span class="badge">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${gotGitHub.link}</li>
    </ul>
  </div>
</div>
<div class="row">
<div class="card col-6" style="width: 18rem;color: white;background-color: #DFAC78">
        <div class="card-body" style="text-align: center;">
            <h2>Public Repositories</h2>
            <p><strong>${gotGitHub.numRepos}</strong></p>
        </div>
    </div>

    <div class="card col-6" style="width: 18rem;color: white;background-color: #DFAC78">
        <div class="card-body" style="text-align: center;">
            <h2>Followers</h2>
            <p><strong>${gotGitHub.followers}</strong></p>

        </div>
    </div>
  </div>
<div class="row">
    <div class="card col-6" style="width: 18rem;color: white;background-color: #DFAC78">
        <div class="card-body" style="text-align: center;">
            <h2>GitHub Stars</h2>
            <p><strong>${gotGitHub.stars}</strong></p>

        </div>
    </div>

    <div class="card col-6" style="width: 18rem;color: white;background-color: #DFAC78">
        <div class="card-body" style="text-align: center;">
            <h2>Following</h2>
            <p><strong>${gotGitHub.following}</strong></p>

        </div>
    </div>
</div>
</body>
</html>`;
}

promptUser()
  .then(async function (answers) {
    try {
      const gotGitHub = await gitHubInfo(answers.gituser);
      // const color = answers.color
      console.log("test", gotGitHub);
      const html = generateHTML(gotGitHub);
      // console.log(color);
      return writeFileAsync("index.html", html);
    } catch (err) {
      console.log("error here", err);
    }
  })
  .then(function () {
    console.log("wrote to index.html");
  })
  .catch(function (err) {
    console.log(err);
  });