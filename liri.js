
require("dotenv").config();

var keys = require("./keys.js");

var consumer_key = keys.twitterKeys.consumer_key;
var consumer_secret = keys.twitterKeys.consumer_secret;
var access_token_key = keys.twitterKeys.access_token_key;
var access_token_secret = keys.twitterKeys.access_token_secret;


var inquirer = require("inquirer");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

var source = "";
var menuArray = ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says", "exit"];


mainMenu();



function mainMenu(){
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "Choose an option below:",
      choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says", "exit"]
    }
  ]).then(function(user) {
    menuSelection(user.selection);
  });
}


function menuSelection(selection) {
  switch(selection) {
    case "my-tweets":
      showTweets();
      break;
    case "spotify-this-song":
      spotifyInput();
      break;
    case "movie-this":
      movieInput();
      break;
    case "do-what-it-says":
      doWhat();
      break;
    case "exit":
      break;
  }
}

function doWhatSelection(action, input) {
  switch(action) {
    case "my-tweets":
      showTweets();
      break;
    case "spotify-this-song":
      spotifyResults(input);
      break;
    case "movie-this":
      movieResults(input);
      break;
    case "Exit":
      break;
  }
}


function showTweets() {
  var client = new twitter({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token_key: access_token_key,
    access_token_secret: access_token_secret
  });

  var params = {screen_name: 'afordfa'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      fs.appendFile("log.txt", "\n\nlog date: " + Date.now() + "\n", function(err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
      });      
      for (var i = 0; i<20; i++) {
        var twitterOutput = "\nTweet sent: " + tweets[i].created_at + "\n" + tweets[i].text + "\n";
        console.log(twitterOutput);


        fs.appendFile("log.txt", twitterOutput, function(err) {
          // If the code experiences any errors it will log the error to the console.
          if (err) {
            return console.log(err);
          }
        });        
      }
      mainMenu();
    }
  });
}



function spotifyInput() {
  source = "spotify";
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "input",
      name: "song",
      message: "Enter a song name",
      default: "The Sign"
    }
  ]).then(function(spotifyUser) {
    spotifyResults(spotifyUser.song)
  });
};



function spotifyResults(song) {
  console.log(song);
  spotify.search({type: 'track', query: song}, function(err, data) {
    if(err) {
      console.log("Error occurred: " + err);
      return;
    }
    var results = data.tracks.items.length;
    fs.appendFile("log.txt", "\n\nlog date: " + Date.now() + "\n", function(err) {
      // If the code experiences any errors it will log the error to the console.
      if (err) {
        return console.log(err);
      }
    });  
    for (var i=-0; i<results; i++) {
      var spotifyOutput = "\n\nartist: " + data.tracks.items[i].album.artists[0].name +
      "\nalbum: " + data.tracks.items[i].album.name +
      "\ntrack: " + console.log("track: " + data.tracks.items[i].name + 
      "\npreview: " + data.tracks.items[i].preview_url);
      console.log(spotifyOutput);
      fs.appendFile("log.txt", spotifyOutput, function(err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
      });   
    }
    if (source === "do-this") {
      mainMenu();
    } else {
    spotifyMenu();
    }
  })
}



function spotifyMenu(){
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "list",
      name: "spotifySelection",
      message: "Make a selection:",
      choices: ["Pick a New Song", "Main Menu", "Exit"]
    }
  ]).then(function(spotifyMenuChoice) {
    switch(spotifyMenuChoice.spotifySelection) {
      case "Pick a New Song":
        spotifyInput();
        break;
      case "Main Menu":
        mainMenu();
        break;
      case "Exit":
        break;
    };
  });
};



function movieInput() {
  source = "movie";
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "input",
      name: "movie",
      message: "Enter a movie name",
      default: "Mr. Nobody"
    }
  ]).then(function(movieUser) {
    movieResults(movieUser.movie)
  });
};



function movieResults(movie) {
  var url = "http://www.omdbapi.com/?t=" + movie + "&plot=short&r=json"

  request(url, function(error, response, body) {
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      // console.log("Title: " + JSON.parse(body).Title);
      // console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      // console.log("Country: " + JSON.parse(body).Country);
      // console.log("Language: " + JSON.parse(body).Language);
      // console.log("Plot: " + JSON.parse(body).Plot);
      // console.log("Actors: " + JSON.parse(body).Actors);
      // console.log("Poster: " + JSON.parse(body).Poster);
      var movieOutput = "\nTitle: " + JSON.parse(body).Title + 
      "\nIMDB Rating: " + JSON.parse(body).imdbRating + 
      "\nCountry: " + JSON.parse(body).Country + 
      "\nLanguage: " + JSON.parse(body).Language + 
      "\nPlot: " + JSON.parse(body).Plot + 
      "\nActors: " + JSON.parse(body).Actors + 
      "\nPoster: " + JSON.parse(body).Poster;

      console.log(movieOutput);
      fs.appendFile("log.txt", "\n\nlog date: " + Date.now() + "\n" + movieOutput, function(err) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
      });   
    }
    if (source === "do-this") {
      mainMenu();
    } else {
      movieMenu();
    }
  }); 
}

function movieMenu(){
  console.log(""); 
  console.log(""); 
  inquirer.prompt([
    {
      type: "list",
      name: "movieSelection",
      message: "Make a selection:",
      choices: ["Pick a New Movie", "Main Menu", "Exit"]
    }
  ]).then(function(movieMenuChoice) {
    switch(movieMenuChoice.movieSelection) {
      case "Pick a New Movie":
        movieInput();
        break;
      case "Main Menu":
        mainMenu();
        break;
      case "Exit":
        break;
    };
  });
};



function doWhat() {
  source = "do-this";
  console.log("done");
  console.log(""); 
  console.log(""); 
  fs.readFile("random.txt", "utf8", function(error, data){
    console.log("")
    console.log("")
    console.log(data);
    var fileArray = data.split(",");
    var action = fileArray[0];
    var randomInput = fileArray[1];
    console.log("action: " + action);
    console.log("input: " + randomInput);
    if (menuArray.indexOf(action) === -1) {
      console.log("Your file is not valid. Select another option");
      mainMenu();
    } else {
      doWhatSelection(action, randomInput);
    }
  })
};