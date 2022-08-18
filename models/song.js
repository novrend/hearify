'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize');
const SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi({
    clientId: '54ad5ca56d494d1ba439c7a366e3f09a',
    clientSecret: 'f916b7c948fe4a48a71b39d2853c8562',
    redirectUri: 'http://www.michaelthelin.se/test-callback'
});
module.exports = (sequelize, DataTypes) => {
  class Song extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Song.hasMany(models.PlaylistSong, { foreignKey: 'SongId', as: 'PlaylistSong'})
    }
    static sortSongs(sort, filter, Song) {
      let obj = {}
      if (filter) {
        obj.where = {
          artist : {
            [Op.eq] : filter
          }
        }
      }
      if (sort) {
        if (sort === 'artist') obj.order = [ ['artist', 'asc'] ]
        else if (sort === 'artistdesc') obj.order = [ ['artist', 'desc'] ]
        else if (sort === 'title') obj.order = [ ['title', 'asc'] ]
        else if (sort === 'titledesc') obj.order = [ ['title', 'desc'] ]
      }
      return Song.findAll(obj)
    }
  }
  Song.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Title cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Title cannot be empty"
        },
        isValidSong(title) {
          spotifyApi.clientCredentialsGrant()
            .then(data=> {
              return spotifyApi.setAccessToken(data.body['access_token']);
            })
            .then(data => {
              return spotifyApi.searchTracks(`track:${title} ${this.artist}`)
            }).then(data => {
              if (typeof data.body.tracks.items[0] == 'undefined') {
                throw new Error('Title song not found')
              }
            }).catch(err => {
              console.log(err)
            })
        }
      }
    },
    artist: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Artist cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Artist cannot be empty"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};