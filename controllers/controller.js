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
        include: [Category, User],
        where: {"CategoryId": categoryId}
      })
    })
    .then((productData) => {
      res.render("products", {categoryData, productData})
    })
    .catch((err) => {
      res.send(err)
    })
  }

  static addProductForm(req, res) {
    
    Category.findAll()
    .then((categoryData) => {
      res.render("productAddForm", {categoryData})
    }).catch((err) => {
      res.send(err)
    });
  }

  static addProduct(req, res) {
    let {name, description, price, stock, imageUrl, CategoryId} = req.body

    Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      CategoryId,
      UserId: '1'
    })
    .then(() => {
      res.redirect('/')
    }).catch((err) => {
      res.send(err)
    });
  }

  static deleteProduct(req, res) {
    let id = req.params.productId

    Product.destroy({where: {id}})
    .then(() => {
      res.redirect('/')
    }).catch((err) => {
      res.send(err)
    });
  }

  static productEditForm(req, res) {
    let id = req.params.productId
    let categoryData = null

    Category.findAll()
    .then((catData) => {
      categoryData = catData
      return Product.findByPk(id)
    }).then((productData) => {
      res.render('productEditForm', {categoryData, productData})
    })
    .catch((err) => {
      res.send(err)
    });
  }

  static productEdit(req, res) {
    let {name, description, price, stock, imageUrl, CategoryId} = req.body
    let id = req.params.productId

    Product.update({
      name,
      description,
      price,
      stock,
      imageUrl,
      CategoryId,
      UserId: '1'
    },{where: {id}})
    .then(() => {
      res.redirect(`/categories/${CategoryId}/products`)
    }).catch((err) => {
      res.send(err)
    });
  }

}

module.exports = Controller