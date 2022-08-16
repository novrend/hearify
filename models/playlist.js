'use strict';
const {
  Model
} = require('sequelize');
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
      Playlist.hasMany(models.PlaylistSong, {foreignKey: 'PlaylistId', as: 'PlaylistSong'})
    }
  }
  Playlist.init({
    name: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    thumbnailUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Playlist',
  });
  return Playlist;
};