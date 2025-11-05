'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  book.init({
    title: {
      type : DataTypes.STRING,
      allowNull : false,
      set(value) {
        this.setDataValue('title', value.trim());
      },
    },
    author: {
      type : DataTypes.STRING,
      allowNull : false,
      set(value) {
        this.setDataValue('author', value.trim());
      }
    },
    description: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    quantity: {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    availability: {
      type : DataTypes.BOOLEAN,
      defaultValue : true,
    }
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};