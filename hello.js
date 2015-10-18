//The number of results to return per request
var MAX_RESULT_COUNT = 30;

//Initializing modules
var app, config, express, expressHandlebars, fs, server, sortByIncidence, soundcloud, url,
	indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};
console.log("Initializing.");


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
app.use(express["static"]('static'));

//Handle requests to /
app.get("/", function(req, res) {
	var page;
	page = {};
	page.title = "SoundVane";
	return res.render('home', page);
});

//Handle requests to /url/*
app.get("/url/*", function(req, res) {
	var link, page, soundcloudUrl;
	
	//Parse the user's URL into a JSON URL object
	link = url.parse(req.originalUrl);
	
	//Retrieve the SoundCloud URL by trimming of the /url/ at the start of the request
	soundcloudUrl = link.pathname.substr(5);
	
	
	page = {};
	//Set up the page title ("Not Found" or not) and error status based on a quick regex
	page.title = "Recommendations"
	var soundcloudPattern = new RegExp( "(https?:\/\/)soundcloud.com\/.+\/sets\/.+" );
	//If the regex fails, return early
	if ( !soundcloudPattern.test( soundcloudUrl ) ) {
		page.title = "Playlist Not Found";
		page.error = true;
		
		//Return early
		return res.render( 'recommendations', page );
	} else {
		//Render the recommendation page
		return soundcloud.getIdRecsList(soundcloudUrl).then(function(results) {
			//console.log(appearanceSort(results));
			//If there were results, sort them
			if (results.length > 0) {
				console.log("I FOUND SOME RESULTS U GUYS");
				console.log(results);
				//Try to sort the results
				page.tracks = appearanceSort(results);
				//Limit to the maximum number of results to display
				if (page.tracks.length > MAX_RESULT_COUNT) {
					page.tracks = page.tracks.slice(0, MAX_RESULT_COUNT);
				}
			} else {
				page.title = "Tracks Not Found";
				page.error = true;
			}
			//Render the page
			return res.render('recommendations', page);
		});
	}
});

appearanceSort = function(arr) {

	// creates arrays/objects
	counts = {};
	sorted = [];
	final = [];

	// put occurrences of numbers in an object (number; value)

	for (var i in arr) {
		counts[arr[i]] = (counts[arr[i]] || 0) + 1;
	}

	//console.log('counts: ' + JSON.stringify(counts));

	// add object to array of arrays

	for (var id in counts) {
		sorted.push([id, counts[id]]);
	}

	// sort array by count of number

	sorted.sort(function(a, b) {
		return b[1] - a[1];
	});

	//console.log('sorted: ' + JSON.stringify(sorted));

	for (i = 0; i < sorted.length; i++) {
		final.push(sorted[i][0]);
	}

	//console.log('final: ' + final);

	return final;

};

app.get("/about", function(req, res) {
	var page;
	page = {};
	page.title = "About Us";
	res.render('about', page);
});

server = app.listen(9001, function() {
	var host, port;
	host = server.address().address;
	port = server.address().port;
});
