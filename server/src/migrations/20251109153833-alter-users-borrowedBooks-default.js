'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.bulkUpdate('users', 
      { borrowedBooks: [] }, // The values to set
      { borrowedBooks: null } // The WHERE clause (conditions)
    );
    
    // Now proceed with changing the column constraints
    return queryInterface.changeColumn('users', 'borrowedBooks', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return queryInterface.changeColumn('users', 'borrowedBooks', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: null, // Or omit for null default
    });
  }
};
