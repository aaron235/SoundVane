# This program hosts a Hello World on port 9001.
console.log( "Initializing." )

express = require( 'express' )
expressHandlebars = require( 'express-handlebars' )

fs = require( 'fs' )
vm = require( 'vm' )

# vm.runInThisContext( fs.readFileSync( __dirname + '/lib/soundcloud.js') )

app = express()

app.engine( 'handlebars', expressHandlebars( { defaultLayout: 'main' } ) )
app.set( 'view engine', 'handlebars' );

# Sets all folders in /static to be served from the root
app.use( express.static( 'static' ) );

app.get( "/", ( req, res ) ->
	res.render( 'home', {title: "TESTAN"} ) )

server = app.listen( 9001, ->
	host = server.address().address
	port = server.address().port

	console.log( "Listening at " + host + ":" + port ) )
