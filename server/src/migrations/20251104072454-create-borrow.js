'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('borrows', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user : {
        type : Sequelize.JSON,
        defaultValue : [],
      },
      price: {
        type : Sequelize.INTEGER,
        allowNull : false,
      },
      bookId: {
        type : Sequelize.INTEGER,
        allowNull : false,
      },
      borrowDate: {
        type : Sequelize.DATE,
        defaultValue : Sequelize.NOW,
      },
      dueDate: {
        type : Sequelize.DATE,
        allowNull : false,
      },
      returnDate: {
        type : Sequelize.DATE,
        allowNull : true,
      },
      fine: {
        type : Sequelize.INTEGER,
        defaultValue : 0,
      },
      notified: {
        type : Sequelize.BOOLEAN,
        defaultValue : false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('borrows');
  }
};