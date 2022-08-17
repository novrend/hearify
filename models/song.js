'use strict';
const {
  Model
} = require('sequelize');
const { Op } = require('sequelize');
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
    title: DataTypes.STRING,
    artist: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Song',
  });
  return Song;
};