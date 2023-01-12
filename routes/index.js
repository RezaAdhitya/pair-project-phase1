const express = require('express')
const router = express.Router()
const categoryRoute = require('./category')
const userRouter = require('./user')
const productRouter = require('./product')
const cartRouter = require('./cart')

router.get('/', (req, res) => {
  res.render('index')
})

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
router.get('/login')
router.post('/login')

// register
router.get('/register')
router.post('/register')

module.exports = router