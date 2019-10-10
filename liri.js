require("dotenv").config();

let axios = require("axios");
let Spotify = require("node-spotify-api");
let fs = require("fs");
let spotifyKeys = require("./keys.js");
let spotify = new Spotify(spotifyKeys.spotify);

const [node, file, ...args] = process.argv;

if (args[0] === "movie-this") {
    if (args[1] === undefined) {
        getMovie("Us");
    }
    else {
        getMovie(args.slice(1).join("+"));
    }
};

if (args[0] === "spotify-this-song") {
    if (args[1] === undefined) {
        spotifySong("Como La Flor");
    }
    else {
        let songTitle = args.slice(1).join(" ");
        spotifySong(songTitle);
    }
};

if (args[0] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        dataArr = data.split(",");
        if (dataArr[0] === "movie-this") {
            if (dataArr[1] === undefined) {
                getMovie("Us")
            }
            else {
                getMovie(dataArr[1].split().join("+"))
            }
        };

        if (dataArr[0] === "spotify-this-song") {
            if (dataArr[1] === undefined) {
                spotifySong("Como La Flor")
            }
            else {
                spotifySong(dataArr[1])
            }
        };
    });
};

function spotifySong(songName) {
    spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        data.tracks.items.forEach(function (element) {
            console.log("");
            console.log(`Artist: ${element.artists[0].name}`);
            console.log(`Song: ${songName}`);
            console.log(`Spotify Preview Link: ${element.preview_url}`);
            console.log(`Album: ${element.album.name}`);
        });
    })
};

function getMovie(movieName) {
    axios
        .get(`http://www.omdbapi.com/?t=${movieName}&apikey=8859e926`)
        .then(function (movie) {
            console.log("");
            console.log(`Title: ${movie.data.Title}`);
            console.log(`Released: ${movie.data.Year}`);
            console.log(`IMDB Rating: ${movie.data.Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating: ${movie.data.Ratings[1].Value}`);
            console.log(`Produced in: ${movie.data.Country}`);
            console.log(`Plot: ${movie.data.Plot}`);
            console.log(`Starring: ${movie.data.Actors}`);
        })
        .catch(function (err) {
            console.log(err);
        });
};