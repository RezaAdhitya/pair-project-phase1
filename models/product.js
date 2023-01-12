'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Cart)
      Product.belongsTo(models.Category, {foreignKey: 'CategoryId'})
      Product.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};