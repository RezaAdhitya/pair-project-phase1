const { Op } = require('sequelize')
const { User, Profile, Category, Product, Cart} = require('../models/index')
const { convertRp } = require('../helpers/helper');
const bcrypt = require('bcryptjs');
const {  isLoggedIn, isCustomer, isSeller, isAdmin } = require('../middlewares/middleware');

class Controller {
  static directToHome(req, res){
    res.render("index")
  }

  static directToLoginPage(req, res){
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    res.render("login", {sessionId, sessionRole})
  }

  static login(req, res){

    let { email, password } = req.body
  
    User.findOne({where: {email}})
    .then(user => {
      if(user){
        let isValidPass = bcrypt.compareSync(password, user.password) // boolean
        if(isValidPass) {
          req.session.userId = user.id
          req.session.userRole = user.role
          console.log(req.session)
          res.redirect('/products')
        } else {
          let error = 'Invalid email/password'
          res.redirect(`/login?error=${error}`)
        }
      } else {
        let error = 'Invalid email/password'
        res.redirect(`/login?error=${error}`)
      }
    })
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect('/')
    })
  }

  static directToRegister(req, res){
    res.render("register")
  }

  static register(req, res){
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
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    
    Category.findAll().then((categories) => {
      res.render("categories", {categories, sessionId, sessionRole})
    }).catch((err) => {
      res.render("error", {err})
    })
  }
  
  static listProductPerCategory(req, res) {
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
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
      res.render("products", {categoryData, productData, convertRp, sessionId, sessionRole})
    }).catch((err) => {
      res.render("error", {err})
    })
  }
  
  static listAllProducts(req, res) {
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    let searchQuery = req.query.search
    let option = {
      include: Category,
      where: {}
    }

    if(searchQuery){
      option.where.name = {
        [Op.iLike]: `%${searchQuery}%`
      }
    }
    // console.log(req.query);
    Product.findAll(option)
    .then((productData) => {
      console.log(sessionId)
      res.render("productsAll", {productData, convertRp, sessionId, sessionRole});
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static listUsers(req, res){
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    User.findAll().then((usersData) => {
      res.render("users", {usersData, sessionId, sessionRole})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static showCart(req, res){
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    // let userId = req.params.userId
    // console.log(sessionId);
    let option = {
      include: [User, Product],
      where: {},
      order: [['id','ASC']]
    }

    if(sessionId){
      option.where.UserId = sessionId
    }

    Cart.findAll(option)
    .then((cart) => {
      res.render("cart", {cart, convertRp, sessionId, sessionRole})
    }).catch((err) =>{
      res.render("error", {err})
    })
  }

  static addAmount(req, res){
    let sessionId = req.session.userId
    let productId = req.params.productId;

    Cart.findOne({
      where: {
        id: productId
      },
      include: Product
    }).then((cartData) => {
      let productStock = cartData.Product.stock

      return Cart.increment('amount', {
        where: {
          id: productId,
          amount: {
            [Op.lt]: productStock
          }
        },
        by: 1
      })
    }).then(() => {
      res.redirect(`/carts/${sessionId}`)
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static subtractAmount(req, res){
    let sessionId = req.session.userId
    let productId = req.params.productId;

    Cart.decrement('amount', {
      where: {
        id: productId,
        amount: {
          [Op.ne]: 0
        }
      },
      by: 1
    }).then(() => {
      res.redirect(`/carts/${sessionId}`)
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static confirmPay(req, res){
    let cartId = req.params.cartId;

    Cart.findOne({
      where: {
        id: cartId
      }
    }).then((cartResult) => {
      console.log(cartResult);

      return Product.decrement('stock', {
        where: {
          id: cartResult.ProductId,
          stock: {
            [Op.ne]: 0
          }
        },
        by: cartResult.amount
      })
    }).then((result) => {
      return Cart.update({
        isPaid: true
      }, {
        where: {
          id: cartId
        }
      })
    }).then((result2) => {
      // console.log(result);
      res.redirect('/carts')
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static deleteCart(req, res){
    let sessionId = req.session.userId
    let cartId = req.params.cartId;

    Cart.destroy({
      where: {
        id: cartId
      }
    }).then((result) => {
      res.redirect(`/carts/${sessionId}`)
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static showProfile(req, res){
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    let userId = req.params.id;

    Profile.findOne({
      include: User,
      where: {
        UserId: userId
      }
    }).then((profile) => {
      let birthDate = Profile.convertDate(profile.dateOfBirth)
      
      res.render("userProfile", {profile, birthDate, sessionId, sessionRole})
    }).catch((err) => {
      res.render("error", {err})
    })
  }

  static editProfileForm(req, res){
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    let userId = req.params.id;

    Profile.findOne({
      where: {
        UserId: sessionId
      },
      include: User
    }).then((profile) => {
      let birthDate = Profile.convertDate(profile.dateOfBirth);

      res.render("profileEditForm", {profile, birthDate, sessionId, sessionRole})
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
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    let {errors} = req.query
    Category.findAll()
    .then((categoryData) => {
      res.render("productAddForm", {categoryData, errors, sessionId, sessionRole})
    }).catch((err) => {
      res.send(err)
    });
  }

  static addProduct(req, res) {
    let sessionId = req.session.userId
    let {name, description, price, stock, CategoryId} = req.body;
    let imageUrl = `\\uploads\\${req.file.filename}`;

    Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      CategoryId,
      UserId: sessionId
    })
    .then(() => {
      res.redirect(`/categories/${CategoryId}/products`)
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
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    let id = req.params.productId
    let categoryData = null

    Category.findAll()
    .then((catData) => {
      categoryData = catData
      return Product.findByPk(id)
    }).then((productData) => {
      res.render('productEditForm', {categoryData, productData, sessionId, sessionRole})
    })
    .catch((err) => {
      res.send(err)
    });
  }

  static productEdit(req, res) {
    let sessionId = req.session.userId
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
      UserId: sessionId
    },{where: {id}})
    .then(() => {
      res.redirect(`/categories/${CategoryId}/products`)
    }).catch((err) => {
      res.send(err)
    });
  }

  static productDetail(req, res) {
    let sessionId = req.session.userId
    let sessionRole = req.session.userRole
    let id = req.params.productId
    console.log(id)
    
    Product.findOne({
      include: [Category, User],
      where: {id}
    })
    .then((productData) => {
      // console.log(productData)
      res.render("productDetail", {productData, convertRp, sessionId, sessionRole})
    }).catch((err) => {
      res.send(err)
    });
  }

  static addToCart(req, res) {
    let sessionId = req.session.userId
    let productId = req.params.productId

    Cart.findOne({
      where: {
        UserId: sessionId,
        ProductId: productId
      }
    })
    .then((cartData) => {
      if (cartData) {
        res.redirect(`/carts/${cartData.id}/add`)
      } else {
        return Cart.create({
          UserId: sessionId,
          ProductId: productId
        })
      }
    })
    .then(() => {
      res.redirect(`/products/${productId}`)
    }).catch((err) => {
      console.log(err)
      // for some reasons this res.send cannot be activated for this function to 'function', so
      // it will remain commented temporarily and the error will only be console logged
      // res.send(err)
    });
  }
}

module.exports = Controller