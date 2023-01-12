const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()

router.get('/', Controller.listCategory)

router.get('/:categoryId/products', Controller.listProductPerCategory)

module.exports = router