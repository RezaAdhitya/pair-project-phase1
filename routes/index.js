const express = require('express')
const router = express.Router()
const categoryRoute = require('./category')
const userRouter = require('./user')
const productRouter = require('./product')
const cartRouter = require('./cart')
const Controller = require('../controllers/controller')

router.get('/', Controller.directToHome)

// landing page

// product
router.use('/products', productRouter)

// categories
router.use('/categories', categoryRoute)

// users
router.use('/users', userRouter)

// cart
router.use('/carts', cartRouter)

// login
router.get('/login', Controller.directToLoginPage)
router.post('/login', Controller.login)

// register
router.get('/register', Controller.directToRegister)
router.post('/register', Controller.register)

module.exports = router