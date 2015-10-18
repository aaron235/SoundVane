# This program hosts a Hello World on port 9001.
console.log( "Initializing." )

express = require( 'express' )
expressHandlebars = require( 'express-handlebars' )

soundcloud = require( './lib/soundcloud' )

app = express()

app.engine( 'handlebars', expressHandlebars( { defaultLayout: 'main' } ) )
app.set( 'view engine', 'handlebars' );

# Sets all folders in /static to be served from the root
app.use( express.static( 'static' ) );

app.get( "/", ( req, res ) ->
	res.render( 'home', {title: "TESTAN"} ) )

app.get( "/url/", ( req, res ) ->
	 )

server = app.listen( 9001, ->
	host = server.address().address
	port = server.address().port

	console.log( "Listening at " + host + ":" + port ) )
