'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type : Sequelize.STRING,
        allowNull : false,
        set(value) {
          this.setDataValue('name', value.trim());
        },
      },
      email: {
        type : Sequelize.STRING,
        allowNull : false,
        set(value) {
          this.setDataValue('email', value.toLowerCase());
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull : false,
      },
      role: {
        type : Sequelize.ENUM('Admin', 'User'),
        defaultValue : "User",
      },
      accountVerified: {
        type : Sequelize.BOOLEAN,
        defaultValue : false,
      },
      borrowedBooks: {
        type : Sequelize.JSON,
      },
      verificationCode: {
        type : Sequelize.INTEGER,
      },
      verificationCodeExpires: {
        type: Sequelize.DATE
      },
      resetPasswordToken: {
        type: Sequelize.STRING
      },
      resetPasswordExpire : {
        type : Sequelize.DATE,
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DATE
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
      }
    }, {
      timestamps : true,
      defaultScope : {
        attributes : {
          exclude : ['password'],
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};