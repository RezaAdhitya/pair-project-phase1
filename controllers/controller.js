const { Op } = require('sequelize')
const { User, Profile, Category, Product, Cart} = require('../models/index')

class Controller {
  static directToHome(req, res){
    res.render("index")
  }

  static directToLoginPage(req, res){
    res.render("login")
  }

  static login(req, res){
    res.redirect('/')
  }

  static directToRegister(req, res){
    res.render("register")
  }

  static register(req, res){
    console.log(req.body);
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    }).then((result) => {
      return Profile.create({
        UserId: result.id,
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        gender: req.body.gender,
        address: req.body.address
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
      res.render("cart", {cart})
    }).catch((err) =>{
      res.render("error", {err})
    })
  }

  static addAmount(req, res){
    let cartId = req.params.cartId;

    Cart.increment('amount', {
      where: {
        id: cartId
      },
      by: 1
    }).then((result) => {
      res.redirect('/carts')
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static subtractAmount(req, res){
    let cartId = req.params.cartId;

    Cart.decrement('amount', {
      where: {
        id: cartId,
        amount: {
          [Op.ne]: 0
        }
      },
      by: 1
    }).then((result) => {
      res.redirect('/carts')
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static confirmPay(req, res){
    let cartId = req.params.cartId;

    Cart.update({
      isPaid: true
    }, {
      where: {
        id: cartId
      }
    }).then((result) => {
      res.redirect('/carts')
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static deleteCart(req, res){
    let cartId = req.params.cartId;

    Cart.destroy({
      where: {
        id: cartId
      }
    }).then((result) => {
      res.redirect('/carts')
    }).catch((err) => {
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
      let birthDate = Profile.convertDate(profile.dateOfBirth)
      
      res.render("userProfile", {profile, birthDate})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static editProfileForm(req, res){
    let userId = req.params.id;

    Profile.findOne({
      where: {
        UserId: userId
      },
      include: User
    }).then((profile) => {
      let birthDate = Profile.convertDate(profile.dateOfBirth);

      res.render("profileEditForm", {profile, birthDate})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static editProfile(req, res){
    let userId = req.params.id;

    User.update({
      username: req.body.username,
      email: req.body.email
    }, {
      where: {
        id: userId
      }
    }).then((result) => {
      return Profile.update({
        name: req.body.name,
        dateOfBirth: req.body.dateOfBirth,
        address: req.body.address,
        gender: req.body.gender
      }, {
        where: {
          UserId: userId
        }
      })
    }).then((result2) => {
      res.redirect(`/users/${userId}`)
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static deleteUser(req, res){
    let userId = req.params.id;

    Profile.destroy({
      where: {
        UserId: userId
      }
    }).then((result) => {
      return User.destroy({
        where: {
          id: userId
        }
      })
    }).then((result2) => {
      res.redirect('/users')
    }).catch((err) => {
      res.render("error", {err})
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
    let {name, description, price, stock, CategoryId} = req.body;
    let imageUrl = `\\uploads\\${req.file.filename}`;

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
      res.redirect(`/categories/${CategoryId}/products`)
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
    let {name, description, price, stock, CategoryId} = req.body
    let id = req.params.productId
    let imageUrl = `\\uploads\\${req.file.filename}`

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