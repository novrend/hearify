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
spotifyApi.setAccessToken('BQDMi8mgG7JDI9y37XpjZaAa2yuCeXb_-RenD-vRWOVFkUZ7XYydAMz1ihS4sXRjEVm12eoqHi-JI61aUQCgcj4Wf8P6NaQrB1YOupRDqgXkngj2mgp2ro3jgmc5jkHH6DTxqj7ihxglExSMRVIdNuFm7XmDIoubXjR9OxpBkQRE4PrOD6J62J3xggU--VW7emPtzNf4UjzwHxJAYGn1wQ');
spotifyApi.getAlbum('1rvWKJpQw9JBleSPrlaGhD')
  .then(function(data) {
    console.log('Album information', data.body);
  }, function(err) {
    console.error(err);
  });
  // spotifyApi.searchTracks('track:Ghost artist:Justin Bieber')
  // .then(function(data) {
  //   console.log( data.body.tracks.items)
  // }, function(err) {
  //   console.log('Something went wrong!', err);
  // });
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