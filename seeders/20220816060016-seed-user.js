'use strict';
const fs = require('fs');
const bcrypt = require('bcryptjs');

module.exports = {
  up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let data = JSON.parse(fs.readFileSync('./data/user.json'))
   data.map(el => {
    el.createdAt = new Date()
    el.updatedAt = new Date()
    const salt = bcrypt.genSaltSync(10)
    el.password = bcrypt.hashSync(el.password, salt)
   })
   return queryInterface.bulkInsert('Users', data, {})
  },

  down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    queryInterface.bulkDelete('Users', null, {})
  }
};
