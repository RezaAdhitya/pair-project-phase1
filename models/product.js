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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Name must be filled'},
        notEmpty: {msg: 'Name must be filled'}
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Description must be filled'},
        notEmpty: {msg: 'Description must be filled'}
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Price must be filled'},
        notEmpty: {msg: 'Price must be filled'},
        min: {args: 1, msg: 'Price cannot be 0'}
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Stock must be filled'},
        notEmpty: {msg: 'Stock must be filled'}
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: 'Category must be selected'},
        notEmpty: {msg: 'Category must be selected'}
      }
    },
    UserId: DataTypes.INTEGER,
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'Image Url must be filled'},
        notEmpty: {msg: 'Image Url must be filled'}
      }
    },
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};