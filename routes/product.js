const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

// product list
router.get('/');

// add product
router.get('/add', Controller.addProductForm);
router.post('/add', Controller.addProduct);

// delete product
router.get('/:productId/delete', Controller.deleteProduct);

// edit product
router.get('/:productId/edit', Controller.productEditForm);
router.post('/:productId/edit', Controller.productEdit);

module.exports = router;