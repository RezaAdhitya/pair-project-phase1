const { User, Profile, Category, Product, Cart} = require('../models/index')
const { convertRp } = require('../helpers/helper');
const bcrypt = require('bcryptjs');

class Controller {
  static directToHome(req, res){
    res.render("index")
  }

  static directToLoginPage(req, res){
    res.render("login")
  }

  static login(req, res){
    let { email, password } = req.body
  
    User.findOne({where: {email}})
    .then(user => {
      if(user){
        let isValidPass = bcrypt.compareSync(password, user.password) // boolean
        console.log(isValidPass)
        if(isValidPass) {
          res.redirect('/')
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
    let {name, description, price, stock, CategoryId} = req.body
    let id = req.params.productId
    console.log(req.file);
    // let imageUrl = `\\uploads\\${req.file.filename}`

    // Product.update({
    //   name,
    //   description,
    //   price,
    //   stock,
    //   imageUrl,
    //   CategoryId,
    //   UserId: '1'
    // },{where: {id}})
    // .then(() => {
    //   res.redirect(`/categories/${CategoryId}/products`)
    // }).catch((err) => {
    //   res.send(err)
    // });
  }

  static productDetail(req, res) {
    let id = req.params.productId
    console.log(id)
    
    Product.findOne({
      include: [Category, User],
      where: {id}
    })
    .then((productData) => {
      // console.log(productData)
      res.render("productDetail", {productData, convertRp})
    }).catch((err) => {
      res.send(err)
    });
  }

  static addToCart(req, res) {
    let productId = req.params.productId

    Cart.create({
      UserId: '1',
      ProductId: productId
    })
    .then(() => {
      res.redirect(`/products/${productId}`)
    }).catch((err) => {
      console.log(err)
      res.send(err)
    });
  }
}

module.exports = Controller