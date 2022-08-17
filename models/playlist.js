'use strict';
const {
  Model
} = require('sequelize');
const SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
    clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
    redirectUri: 'http://www.michaelthelin.se/test-callback'
});
const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Playlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Playlist.belongsTo(models.User, {foreignKey: 'UserId'})
      Playlist.hasMany(models.PlaylistSong, {foreignKey: 'PlaylistId'})
    }
    static spotifyApi(ress, data) {
      spotifyApi.clientCredentialsGrant()
      spotifyApi.setAccessToken(data.body['access_token']);
      const send = song =>
        new Promise(resolve => {
          resolve(spotifyApi.searchTracks(`track:${song.Song.title} ${song.Song.artist}`))
      });
      const getSpotifyDetail = async () => {
        for (let song of ress) {
          const songs = await send(song)
          if (typeof songs.body.tracks.items[0] !== 'undefined') {
            song.Song.link = songs.body.tracks.items[0].preview_url
            song.Song.album = songs.body.tracks.items[0].album.images[1].url
          }
        }
        return true
      };
      return getSpotifyDetail();
    }
    static spotifyApi2(ress, data) {
      spotifyApi.clientCredentialsGrant()
      spotifyApi.setAccessToken(data.body['access_token']);
      const send = song =>
        new Promise(resolve => {
          resolve(spotifyApi.searchTracks(`track:${song.title} ${song.artist}`))
      });
      const getSpotifyDetail = async () => {
        for (let song of ress) {
          const songs = await send(song)
          if (typeof songs.body.tracks.items[0] !== 'undefined') {
            song.link = songs.body.tracks.items[0].preview_url
            song.album = songs.body.tracks.items[0].album.images[1].url
          }
        }
        return true
      };
      return getSpotifyDetail();
    }
    static sortPlaylist(playlistId, sort, PlaylistSong, Song) {
      let obj = {
        include : [{
          model: PlaylistSong,
          include: [{
              model: Song,
          }]
        }],
        where: {
            id : {
                [Op.eq] : playlistId
            }
        }
      }
      if (sort) {
        if (sort === 'artist') obj.order = [ [PlaylistSong, Song, 'artist', 'asc'] ]
        else if (sort === 'artistdesc') obj.order = [ [PlaylistSong, Song, 'artist', 'desc'] ]
        else if (sort === 'title') obj.order = [ [PlaylistSong, Song, 'title', 'asc'] ]
        else if (sort === 'titledesc') obj.order = [ [PlaylistSong, Song, 'title', 'desc'] ]
      }
      return Playlist.findOne(obj)
    }
  }
  Playlist.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args : [2,10],
          msg: "Min length is two characters and max length is ten characters"
        }
      }
    },
    UserId: DataTypes.INTEGER,
    thumbnailUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};