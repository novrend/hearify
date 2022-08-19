const SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
    clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
});
spotifyApi.clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
    })
module.exports = spotifyApi