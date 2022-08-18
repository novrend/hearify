'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize');
let spotifyApi = require('../helpers/spotifyApi');

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
    static sortSongs(sort, filter) {
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
      return this.findAll(obj)
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