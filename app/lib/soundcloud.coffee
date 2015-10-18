https = require( 'https' )
url = require( 'url' )

clientID = ""

module.exports = {

	setApiKey: ( ApiKey ) ->
		clientID = ApiKey

	getJSON: ( trackID ) ->
		https.get(url, (res) ->

			body = ''

			res.on('data', ( chunk ) ->
				body += chunk;
			)

			res.on('end', ->
				return JSON.parse(body)
			)
		).on('error', (e) ->
			console.log("Got an error: ", e)
		)

	getTracksId: ( trackUrl ) ->

		console.log( "https://api.soundcloud.com/resolve.json?client_id=" + clientID +
		             "&url=" + encodeURIComponent( trackUrl ) )
		# request looks liek this:
		# https://api.soundcloud.com/resolve.json?url=https%3A%2F%2Fsoundcloud.com%2Fmsmrsounds%2Fms-mr-hurricane-chvrches-remix&client_id=[your_client_id]
		https.get( "https://api.soundcloud.com/resolve.json?client_id=" + clientID + "&url=" + encodeURIComponent( trackUrl ), ( res ) ->
			res.on( 'data', ( body ) ->
				https.get( JSON.parse( body.toString() ).location, ( res ) ->
					res.on( 'data', ( trackInfo ) ->
						return JSON.parse( trackInfo ).id ) ) ) )



}
