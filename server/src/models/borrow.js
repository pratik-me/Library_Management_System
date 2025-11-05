'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class borrow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  borrow.init({
    user : {
      type : DataTypes.JSON,
      defaultValue : [],
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    bookId: {
      type : DataTypes.INTEGER,
      allowNull : false,
    },
    borrowDate: {
      type : DataTypes.DATE,
      defaultValue : Date.now(),
    },
    dueDate: {
      type : DataTypes.DATE,
      allowNull : false,
    },
    returnDate: {
      type : DataTypes.DATE,
      allowNull : true,
    },
    fine: {
      type : DataTypes.INTEGER,
      defaultValue : 0,
    },
    notified: {
      type : DataTypes.BOOLEAN,
      defaultValue : false,
    }
  }, {
    sequelize,
    modelName: 'borrow',
  });
  return borrow;
};