'use strict';
const {
  Model
} = require('sequelize');
let spotifyApi = require('../helpers/spotifyApi');

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
    static spotifyApi(ress) {
      let promises = []
      for (let song of ress) {
        promises.push(spotifyApi.searchTracks(`track:${song.title ? song.title : song.Song.title} ${song.artist ? song.artist : song.Song.artist}`))
      }
      return Promise.all(promises)
    }
    static sortPlaylist(playlistId, sort, filter) {
      let obj = {
        include : {
          model: sequelize.models.PlaylistSong,
          include : 'Song'
        },
        where: {
            id : {
                [Op.eq] : playlistId
            }
        }
      }
      if (filter) {
        obj.include[0].include[0].where = {
          artist : {
            [Op.eq] : filter
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
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Thumbnail url cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Thumbnail url cannot be empty"
        },
        isUrl: {
          args: true,
          msg: "Please input valid url format"
        },
        isImage(thumbnailUrl) {
          if (!['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'].includes(thumbnailUrl.slice(-4))){
            throw new Error('Only PNG, JPG, and JPEG files')
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};