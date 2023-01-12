'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Cart)
      User.hasMany(models.Product)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate: {
        notNull: {msg: 'Username cannot be empty'},
        notEmpty: {msg: 'Username cannot be empty'},
        isLong(val) {
          if(val.length < 8) {
            throw new Error(`Username must be 8 characters minimum`)
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate: {
        notNull: {msg: 'Email cannot be empty'},
        notEmpty: {msg: 'Email cannot be empty'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Password cannot be empty'},
        notEmpty: {msg: 'Password cannot be empty'},
        isLong(val) {
          if(val.length < 8) {
            throw new Error(`Password must be 8 characters minimum`)
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Please select a role'},
        notEmpty: {msg: 'Please select a role'}
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  User.addHook('beforeCreate', (user, option) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);

    user.password = hash;
  });
  return User;
};