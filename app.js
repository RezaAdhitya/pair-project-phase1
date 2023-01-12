const express = require('express')
const router = require('./routes')
const app = express()
const port = 3000
const router = require('./routers/index')
const userRouter = require('./routers/users')
const categoryRouter = require('./routers/categories')
const productRouter = require('./routers/products')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));


// landing page
app.use('/', router)

// product
app.use('/products', productRouter)

// categories
app.use('/categories', categoryRouter)

// users
app.use('/users', userRouter)

app.use(router)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})