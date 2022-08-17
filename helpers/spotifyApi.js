var SpotifyWebApi = require('spotify-web-api-node');
// spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
//     function(data) {
//       console.log('Artist albums', data.body);
//     },
//     function(err) {
//       console.error(err);
//     }
//   );

//   spotifyApi.searchTracks('Rex Orange County THE SHADE')
//   .then(function(data) {
//     console.log('Search by "THE SHADE"', data.body.tracks.items[0].artists);
//   }, function(err) {
//     console.error(err);
//   });

//   spotifyApi.searchArtists('Love')
//   .then(function(data) {
//     console.log('Search artists by "Love"', data.body);
//   }, function(err) {
//     console.error(err);
//   });
  // credentials are optional
  // var spotifyApi = new SpotifyWebApi({
  //   clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
  //   clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
  //   redirectUri: 'http://localhost:8888/callback'
  // });

  // var clientId = 'someClientId',
  // clientSecret = 'someClientSecret';

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
  clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
});

// Retrieve an access token.
// spotifyApi.clientCredentialsGrant().then(
//   function(data) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//   },
//   function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
//   }
// );
spotifyApi.setAccessToken('BQDRSHue2YUdbDpfXVC_kuR90dLo1HSLGwPdiYcKubHNyofjZL2vpSQ6iQSFgAhuZVbdznZgjlrQDaI7LVH5WANlTcshD1aCBgGvo3WTvGJgYwvUFYw');
// spotifyApi.getAlbum('1rvWKJpQw9JBleSPrlaGhD')
//   .then(function(data) {
//     console.log('Album information', data.body);
//   }, function(err) {
//     console.error(err);
//   });
  spotifyApi.searchTracks(`track:Youre Gonna Live Forever in Me John Mayer`)
  .then(function(data) {
    console.log( data.body)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
  // spotifyApi.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK')
  // .then(function(data) {
  //   console.log(data.body);
  // }, function(err) {
  //   done(err);
  // });
// spotifyApi.getAudioFeaturesForTrack('3Qm86XLflmIXVm1wcwkgDK')
//   .then(function(data) {
//     console.log(data.body);
//   }, function(err) {
//     done(err);
//   });