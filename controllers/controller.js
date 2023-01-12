const { User, Profile, Category, Product, Cart} = require('../models/index')

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
        include: Category,
        where: {"CategoryId": categoryId}
      })
    }).then((productData) => {
      res.render("products", {categoryData, productData})
    }).catch((err) => {
      res.render("error", {err})
    })
  }
  
  static listAllProduct(req, res) {
    Product.findAll().then((productsData) => {
      res.render("products", {productsData});
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  listUsers(req, res){
    User.findAll().then((usersData) => {
      res.render("users", {usersData})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  showCart(req, res){
    let userId = req.params.userId
    let option = {
      include: [User, Product],
      where: {}
    }

    if(userId){
      option.where.UserId = userId
    }

    Cart.findAll(option).then((cart) => {
      res.render("cart", {cart})
    }).catch((err) =>{
      res.render("error", {err})
    })
  }

  showProfile(req, res){
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
}

module.exports = Controller