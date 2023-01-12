const { User, Profile, Category, Product, Cart} = require('../models/index');

class Controller {

  static listCategory(req, res) {

    Category.findAll()
    .then((categories) => {
      res.render("categories", {categories})
    }).catch((err) => {
      res.send(err)
    });
  }

  static listAllProduct(req, res) {

  }

  static listProductPerCategory(req, res) {
    let categoryId = req.params.categoryId
    let categoryData = null
    Category.findByPk(categoryId)
    .then((catData) => {
      categoryData = catData
      return Product.findAll({
        include: Category,
        where: {"CategoryId": categoryId}
      })
    })
    .then((productData) => {
      console.log(productData)
      res.render("products", {categoryData, productData})
    })
    .catch((err) => {
      res.send(err)
    })
  }

}

module.exports = Controller