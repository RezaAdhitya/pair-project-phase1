const express = require('express')
const router = express.Router()
const categoryRoute = require('./category');
const userRouter = require('./routers/users')
const categoryRouter = require('./routers/categories')
const productRouter = require('./routers/products')


router.get('/', (req, res) => {
  res.render('index')
})

// landing page
app.use('/', router)

// product
app.use('/products', productRouter)

// categories
app.use('/categories', categoryRouter)

// users
app.use('/users', userRouter)

// define the about route
router.use('/categories', categoryRoute)

module.exports = router