const express = require('express')
const app = express()
const port = 3000
const router = require('./routers/index')
const userRouter = require('./routers/users')
const categoryRouter = require('./routers/categories')
const productRouter = require('./routers/products')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

// landing page
app.use('/', router)

// product
app.use('/products', productRouter)

// categories
app.use('/categories', categoryRouter)

// users
app.use('/users', userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})