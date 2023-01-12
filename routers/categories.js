const express = require('express');
const router = express.Router();

// category list
router.get('/');

// product list based on category
router.get('/:categoryId/products');

module.exports = router;