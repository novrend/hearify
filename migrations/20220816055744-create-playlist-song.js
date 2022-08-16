'use strict';
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('PlaylistSongs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PlaylistId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Playlists',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      SongId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Songs',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('PlaylistSongs');
  }
};