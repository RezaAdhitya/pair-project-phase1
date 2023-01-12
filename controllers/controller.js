const { User, Profile, Category, Product, Cart} = require('../models/index')
const { convertRp } = require('../helpers/helper');

class Controller {
  static directToHome(req, res){
    res.render("index")
  }

  static directToLoginPage(req, res){
    res.render("login")
  }

  static login(req, res){

  }

  static directToRegister(req, res){
    res.render("register")
  }

  static register(req, res){
    User.create({

    }).then((result) => {
      return Profile.create({

      })
    }).then((result2) => {
      res.redirect('/')
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static listCategory(req, res) {
    Category.findAll().then((categories) => {
      res.render("categories", {categories})
    }).catch((err) => {
      res.render("error", {err})
    })
  }
  
  static listProductPerCategory(req, res) {
    let categoryId = req.params.categoryId
    let categoryData = null
    
    Category.findByPk(categoryId).then((catData) => {
      categoryData = catData
      
      return Product.findAll({
        include: [Category, User],
        where: {"CategoryId": categoryId}
      })
    })
    .then((productData) => {
      res.render("products", {categoryData, productData, convertRp})
    }).catch((err) => {
      res.render("error", {err})
    })
  }
  
  static listAllProduct(req, res) {
    Product.findAll().then((productsData) => {
      res.render("products", {productsData, convertRp});
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static listUsers(req, res){
    User.findAll().then((usersData) => {
      res.render("users", {usersData})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static showCart(req, res){
    let userId = req.params.userId
    let option = {
      include: [User, Product],
      where: {}
    }

    if(userId){
      option.where.UserId = userId
    }

    Cart.findAll(option).then((cart) => {
      res.render("cart", {cart, convertRp})
    }).catch((err) =>{
      res.render("error", {err})
    })
  }


  static showProfile(req, res){
    let userId = req.params.id;

    Profile.findOne({
      where: {
        UserId: userId
      },
      include: User
    }).then((profile) => {
      res.render("profile", {profile})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static addProductForm(req, res) {
    let {errors} = req.query
    Category.findAll()
    .then((categoryData) => {
      res.render("productAddForm", {categoryData, errors})
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
      if (err.name = "SequelizeValidationError") {
        let errors = err.errors.map(el => el.message)
        res.redirect(`/products/add?errors=${errors}`)
      } else {
        res.send(err)
      }
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