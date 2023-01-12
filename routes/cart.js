const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

// cart masterlist
router.get('/', Controller.showCart);

// user's cart
router.get('/:userId', Controller.showCart);

// add cart
router.get('/:productId/addToCart', Controller.addToCart)

// manipulate buying amount
router.get('/:cartId/add');
router.get('/:cartId/sub');

// confirm payment
router.get('/:cartId/confirm');

// delete cart data
router.get('/:cartId/delete',);

module.exports = router;