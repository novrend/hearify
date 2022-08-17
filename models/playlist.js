'use strict';
const {
  Model
} = require('sequelize');
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