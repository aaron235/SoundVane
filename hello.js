"use strict";
//The number of results to return per request
var MAX_RESULT_COUNT = 30;

//Initializing modules
var app, config, express, expressHandlebars, fs, server, sortByIncidence, soundcloud, url, indexOf = [].indexOf || function (item) {
	for (var i = 0, l = this.length; i < l; i++) {
		if (i in this && this[i] === item) return i;
	}
	return -1;
};

//Import modules
express = require('express');
expressHandlebars = require('express-handlebars');
url = require('url');
fs = require('fs');

//Configure Soundcloud
config = JSON.parse(fs.readFileSync("./config.json"));
soundcloud = require('./lib/soundcloud');
soundcloud.setApiKey(config.clientId);

//Set up app and handlebars
app = express();
app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 9001));
app.use(express["static"]('static'));

/*
Handle requests to /
*/
app.get("/", function (req, res) {
	var page;
	page = {};
	page.title = "SoundVane";
	return res.render('home', page);
});

/*
Handle requests to /about
*/
app.get("/about", function (req, res) {
	var page;
	page = {};
	page.title = "About Us";
	res.render('about', page);
});

/*
Handle requests to /url/*
*/
app.get("/url/*", function (req, res) {

	// Get the URL to recommend from
	var rawURL = url.parse(req.originalUrl).pathname.substr(5);
	var soundCloudURL = cleanUpSoundCloudURL(rawURL);

	console.log("Recommending From:", soundCloudURL);

	//Get the recommendations from that URL and return a page of recommendations

	return soundcloud.getRecommendations(soundCloudURL).then(function (results) {
		//Setup the results page
		var page = {};
		page.url = soundCloudURL;
		page.title = "Recommendations";
		//Check if we actually got results
		if (results.length > 0) {
			//Sort the results
			page.tracks = rankTracks(results);
			//Limit to the maximum number of results to display
			if (page.tracks.length > MAX_RESULT_COUNT) {
				page.tracks = page.tracks.slice(0, MAX_RESULT_COUNT);
			}
		} else {
			// If we didn't get results, change the title and show the error page
			page.title = "Oops!";
			page.error = true;
		}

		//Render the page
		return res.render('recommendations', page);
	});


});

function rankTracks(tracks) {
	var countsByTrackID = {};
	var tracksByTrackID = {};

	//Make dictionaries of counts and track objects with trackIDs as their key
	for (var i = 0; i < tracks.length; i++) {
		var t = tracks[i];
		//Add id: track as a KVP in tracksByTrackID
		tracksByTrackID[t.id] = t;
		//Add id: count as a KVP in counts
		countsByTrackID[t.id] = (countsByTrackID[t.id] || 0) + 1;
	}
	//Array of track IDs (will be sorted and returned)
	var trackIDs = Object.keys(countsByTrackID);

	//Sort the array of track IDs
	trackIDs.sort(function (a, b) {
		//First by occurrence count
		if (countsByTrackID[b] - countsByTrackID[a]) {
			return (countsByTrackID[b] - countsByTrackID[a]);
		} else {
			//Then by reposts/plays
			var trackA = tracksByTrackID[a];
			var trackB = tracksByTrackID[b];
			return (trackB.reposts_count / trackB.playback_count || 0) - (trackA.reposts_count / trackA.playback_count || 0);
		}
	});

	//Return the sorted array of track IDs
	return trackIDs;
};

function cleanUpSoundCloudURL(soundCloudURL) {
	//Remove the URL prefix if it's present
	var soundCloudURLPrefix = /.*soundcloud.com\//i;
	soundCloudURL = soundCloudURL.replace(soundCloudURLPrefix, "");

	//Make sure the URL has "/likes" at the end if it's not a set
	//If the URL is a set, leave it alone
	var soundCloudParts = soundCloudURL.split("/");
	if (soundCloudParts.indexOf("sets") == -1) {
		soundCloudURL = soundCloudParts[0] + "/likes";
	}

	//Re-add the URL prefix and return it
	return "https://www.soundcloud.com/" + soundCloudURL;
}

//Listen for requests to the server
server = app.listen(app.get('port'), function () {
	console.log("Listening at port...", app.get('port'));
});
