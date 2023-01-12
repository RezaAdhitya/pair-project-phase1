'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, {foreignKey: 'UserId'})
    }

    static convertDate(input){
      // const dateVal = this.dateOfBirth;
      // console.log(this.dateOfBirth);

      let month = input.getMonth() + 1;
      let day = input.getDate();
      let year = input.getFullYear();

      if(month.toString().length < 2){
        month = '0' + month;
      }

      if(day.toString().length < 2){
        day = '0' + day;
      }

      return [year, month, day].join('-');
    }
  }
  Profile.init({
    UserId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Name cannot be empty'},
        notEmpty: {msg: 'Name cannot be empty'}
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {msg: 'Please select a date'},
        notEmpty: {msg: 'Please select a date'}
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Please select a gender'},
        notEmpty: {msg: 'Please select a gender'}
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Address cannot be empty'},
        notEmpty: {msg: 'Address cannot be empty'}
      }
    },
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};