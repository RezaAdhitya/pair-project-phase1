const express = require('express')
const router = express.Router()
const categoryRoute = require('./category')
const userRouter = require('./user')
const productRouter = require('./product')
const cartRouter = require('./cart')
const Controller = require('../controllers/controller')


// register
router.get('/register', Controller.directToRegister)
router.post('/register', Controller.register)

// login
router.get('/login', Controller.directToLoginPage)
router.post('/login', Controller.login)

// landing page
router.get('/', Controller.directToHome)

// product
router.use('/products', productRouter)

// categories
router.use('/categories', categoryRoute)

// users
router.use('/users', userRouter)

// cart
router.use('/carts', cartRouter)



module.exports = router