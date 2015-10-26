'use strict';
var clientID, getJSON, gettrackIDCallback, getTracksId, https, url;

//Import modules
var https = require('follow-redirects').https,
	url = require('url'),
	q = require('q');

clientID = "";

module.exports = {
	//Set the API key used when contacting SoundCloud
	setApiKey: function (ApiKey) {
		return clientID = ApiKey;
	},

	//Return a promise for an array of recommendations based on a given SoundCloud URL
	getRecommendations: function (soundCloudURL) {
		//Set up the promise
		var result = q.defer();

		//Get all of the track IDs from the specified URL
		gettrackIDs(soundCloudURL).then(function (trackIDs) {
			//Make an array of promises containing arrays of recommendations for each of the tracks
			var relatedTrackListPromises = [];
			trackIDs.map((trackID) => {
				relatedTrackListPromises.push(getRelatedTracksForTrackID(trackID));
			});

			var relatedTracks = [];
			//Once related tracks have all come in, store them in result[] and resolve it.
			q.all(relatedTrackListPromises).then((relatedTrackLists) => {
				//Go through each array of recommendations
				relatedTrackLists.map((relatedTrackList) => {
					//Add all the related tracks from this array to the overall list
					relatedTracks = relatedTracks.concat(relatedTrackList);
				});
				
				//Resolve the promise for the overall list
				result.resolve(relatedTracks);
			});
		});

		//Return a promise to give the array of all related tracks
		return result.promise;
	}
};

// Returns a promise for an array of tracks related to the given track
function getRelatedTracksForTrackID(trackID) {
	//Set up the promise
	var result = q.defer();

	//Grab the related tracks
	https.get("https://api-v2.soundcloud.com/tracks/" + trackID + "/related", function (res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', () => {
			//Make an array of all related tracks 
			var relatedTracks = [];
			JSON.parse(body.toString()).collection.map((track) => {
				relatedTracks.push(track);
			});
			result.resolve(relatedTracks);
		});
	});

	//Return a promise to give the array of related tracks
	return result.promise;
}

function gettrackIDs(soundCloudURL) {

	var d = q.defer();
	var trackIDs = [];
	https.get("https://api.soundcloud.com/resolve.json?client_id=" + clientID + "&url=" + encodeURIComponent(soundCloudURL), function (res) {
		var body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', () => {
			var tracks = JSON.parse(body.toString());
			//If we fetched data for a set, then the actual tracks are in a .tracks field, so use that instead.
			if (tracks.tracks) {
				tracks = tracks.tracks;
			}
			//If there are no tracks at this URL, don't try and read properties of them
			if (tracks.length > 0) {
				tracks.map((el) => {
					trackIDs.push(el.id);
				});
			}
			//Return the list of recommended track IDs
			d.resolve(trackIDs);
		});
	});

	return d.promise;
};

function getJSON(trackID) {
	return https.get(url, function (res) {
		var body;
		body = '';
		res.on('data', function (chunk) {
			return body += chunk;
		});
		return res.on('end', function () {
			return JSON.parse(body);
		});
	}).on('error', function (e) {
		return console.log("Got an error: ", e);
	});
};

function $http(url) {

	// A small example of object
	var core = {

		// Method that performs the ajax request
		ajax: function (method, url, args) {

			// Creating a promise
			var promise = new Promise(function (resolve, reject) {

				// Instantiates the XMLHttpRequest
				var client = new XMLHttpRequest();
				var uri = url;

				if (args && (method === 'POST' || method === 'PUT')) {
					uri += '?';
					var argcount = 0;
					for (var key in args) {
						if (args.hasOwnProperty(key)) {
							if (argcount++) {
								uri += '&';
							}
							uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
						}
					}
				}

				client.open(method, uri);
				client.send();

				client.onload = function () {
					if (this.status >= 200 && this.status < 300) {
						// Performs the function "resolve" when this.status is equal to 2xx
						resolve(this.response);
					} else {
						// Performs the function "reject" when this.status is different than 2xx
						reject(this.statusText);
					}
				};
				client.onerror = function () {
					reject(this.statusText);
				};
			});

			// Return the promise
			return promise;
		}
	};

	// Adapter pattern
	return {
		'get': function (args) {
			return core.ajax('GET', url, args);
		},
		'post': function (args) {
			return core.ajax('POST', url, args);
		},
		'put': function (args) {
			return core.ajax('PUT', url, args);
		},
		'delete': function (args) {
			return core.ajax('DELETE', url, args);
		}
	};
};