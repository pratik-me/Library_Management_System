'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull : false,
        set(value) {
          this.setDataValue('title', value.trim());
        },
      },
      author: {
        type: Sequelize.STRING,
        allowNull : false,
        set(value) {
          this.setDataValue('author', value.trim());
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull : false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull : false,
      },
      availability: {
        type: Sequelize.BOOLEAN,
        defaultValue : true,
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
    await queryInterface.dropTable('books');
  }
};