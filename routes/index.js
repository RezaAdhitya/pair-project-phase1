const express = require('express')
const router = express.Router()
const categoryRoute = require('./category')
const userRouter = require('./user')
const productRouter = require('./product')
const cartRouter = require('./cart')
const Controller = require('../controllers/controller')
const { isLoggedIn, isCustomer, isSeller, isAdmin } = require('../middlewares/middleware');


// landing page
router.get('/', Controller.directToHome)

// register
router.get('/register', Controller.directToRegister)
router.post('/register', Controller.register)

// login
router.get('/login', Controller.directToLoginPage)
router.post('/login', Controller.login)

// categories
router.use('/categories', categoryRoute)

// product
router.use('/products', productRouter)

// users
router.use('/users', isLoggedIn, userRouter)

// cart
router.use('/carts', isLoggedIn, cartRouter)


module.exports = router