# This program hosts a Hello World on port 9001.
console.log( "Initializing." )

express = require( 'express' )
expressHandlebars = require( 'express-handlebars' )

app = express()

app.engine( 'handlebars', expressHandlebars( { defaultLayout: 'main' } ) )
app.set( 'view engine', 'handlebars' );

app.get( "/", ( req, res ) ->
	res.render( 'home', {title: "TESTAN"} ) )

server = app.listen( 9001, ->
	host = server.address().address
	port = server.address().port

	console.log( "Listening at " + host + ":" + port ) )
