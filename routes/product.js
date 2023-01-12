const express = require('express');
const router = express.Router();

// product list
router.get('/');

// add product
router.get('/products/add');
router.post('/products/add');

// edit product
router.get('/products/edit/:id');
router.post('/products/edit/:id');

module.exports = router;