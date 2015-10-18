# This program hosts a Hello World on port 9001.
console.log( "Initializing." )

# This is our framework! Also we have a version of handlebars designed to work with it.
express = require( 'express' )
expressHandlebars = require( 'express-handlebars' )

# This is for parsing Soundcloud URLs.
url = require( 'url' )

# This gets our configuration out of the file:
fs = require( 'fs' )
config = JSON.parse( fs.readFileSync( "./config.json" ) )

# This is our application library for getting Soundcloud URLs.
soundcloud = require( './lib/soundcloud' )
soundcloud.setApiKey( config.clientId )

# Our entire express app is stored in 'app'
app = express()

# set handlebars as our templating engine:
app.engine( 'handlebars', expressHandlebars( { defaultLayout: 'main' } ) )
app.set( 'view engine', 'handlebars' );

# Sets all folders in /static to be served from the root
app.use( express.static( 'static' ) );

# For requests to the root, render home
app.get( "/", ( req, res ) ->
	page = {}

	page.title = "SoundVane"

	res.render( 'home', page ) )

# And for requests to url/track, do this:
app.get( "/url/*", ( req, res ) ->

	link = url.parse( req.originalUrl )
	soundcloudUrl = link.pathname.substr(5)

	page = {}
	console.log( "stopit")
	soundcloud.getIdRecsList( soundcloudUrl ).then(
		( results ) ->
			console.log( results )
			page.tracks = sortByIncidence( results )

			if ( link.host != "soundcloud.com" )
				page.title = "Whoops."
			else
				page.title = "Recommendations"
			console.log( page )
			res.render( 'recommendations' , page ) )
	)

sortByIncidence = ( array ) ->
	frequency = {}
	value = 0
	for i in [1..array.length]
		value = array[i]
		if value in frequency
			frequency[value]++
		else
			frequency[value] = 1

	unique = []
	for value in frequency
		unique.push( value )

	compareTo = (a, b) ->
		return frequency[b] - frequency[a]

	return unique.sort(compareTo)

###
var frequency = {}, value;
for(var i = 0; i < array.length; i++) {
    value = array[i];
    if(value in frequency) {
        frequency[value]++;
    }
    else {
        frequency[value] = 1;
    }
}

var unique = [];
for(value in frequency) {
    unique.push(value);
}

function compareTo(a, b) {
    return frequency[b] - frequency[a];
}
###
# About sends you to the about view.
app.get( "/about", ( req, res ) ->

	page = {}

	page.title = "About Us"

	res.render( 'about' , page ) )

# REV THIS BITCH UP
server = app.listen( 9001, ->
	host = server.address().address
	port = server.address().port



	#console.log( "Listening at " + host + ":" + port ) )
	)
