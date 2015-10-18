https = require( 'https' )

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

	getTracksId: ( trackID ) ->
		response = jetJSON(trackID)
		trackArray = []
		for track in resp.collection
			trackArray.push( track )
		return trackArray

}
