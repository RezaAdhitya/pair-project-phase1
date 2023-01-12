const express = require('express')
const router = express.Router()
const categoryRoute = require('./category');
const userRouter = require('./user')
const productRouter = require('./product')


router.get('/', (req, res) => {
  res.render('index')
})

// landing page
app.use('/', router)

// product
app.use('/products', productRouter)

// categories
router.use('/categories', categoryRoute)

// users
app.use('/users', userRouter)

// login
app.get('/login')
app.post('/login')

// register
app.get('/register')
app.post('/register')



module.exports = router