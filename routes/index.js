const express = require('express')
const router = express.Router()
const categoryRoute = require('./category');


router.get('/', (req, res) => {
  res.render('index')
})
// define the about route
router.use('/categories', categoryRoute)

module.exports = router