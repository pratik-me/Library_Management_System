'use strict';
const { parse } = require('dotenv');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
    generateVerificationCode() {
      function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4,0);
        return parseInt(firstDigit + remainingDigits);
      }
  
      const verificationCode = generateRandomFiveDigitNumber();
      this.verificationCode = verificationCode;
      this.verificationCodeExpires = Date.now() + 15 * 60 * 1000;
      return verificationCode;
    }

    generateToken() {
      return jwt.sign({
        id : this.id
      }, process.env.JWT_SECRET_KEY, {
        expiresIn : process.env.JWT_EXPIRE,
      })
    }

    getResetPasswordToken() {
      const resetToken = crypto.randomBytes(20).toString("hex");
      
      this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
      
      return resetToken;
    }

    static associate(models) {
      // define association here
    }
  }
  user.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      set(value) {
        this.setDataValue('name', value.trim());
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
    },
    role: {
      type : DataTypes.ENUM('Admin', 'User'),
      defaultValue : "User",
    },
    accountVerified: {
      type : DataTypes.BOOLEAN,
      defaultValue : false,
    },
    borrowedBooks: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
  },
    verificationCode: DataTypes.INTEGER,
    verificationCodeExpires: DataTypes.DATE,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire : DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'user',

    defaultScope: {
      attributes: {
        exclude: ['password']
      }
    },
  });

  return user;
};