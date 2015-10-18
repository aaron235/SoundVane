# This program hosts a Hello World on port 9001.
console.log( "Initializing." )

# This is our framework! Also we have a version of handlebars designed to work with it.
express = require( 'express' )
expressHandlebars = require( 'express-handlebars' )

# This is for parsing Soundcloud URLs.
url = require( 'url' )

# This is our application library for getting Soundcloud URLs.
soundcloud = require( './lib/soundcloud' )

# Our entire express app is stored in 'app'
app = express()

# set handlebars as our templating engine:
app.engine( 'handlebars', expressHandlebars( { defaultLayout: 'main' } ) )
app.set( 'view engine', 'handlebars' );

# Sets all folders in /static to be served from the root
app.use( express.static( 'static' ) );

# For requests to the root, render home
app.get( "/", ( req, res ) ->
	res.render( 'home', {title: "TESTAN"} ) )

# And for requests to url/track, do this:
app.get( "/url/.+", ( req, res ) ->

	res.render( 'recommendations' , {title: "Recommendations:"} ) )

# About sends you to the about view.
app.get( "/about", ( req, res ) ->
	res.render( 'about' , { title: "About Us!" } ) )

# REV THIS BITCH UP
server = app.listen( 9001, ->
	host = server.address().address
	port = server.address().port

	console.log( "Listening at " + host + ":" + port ) )
