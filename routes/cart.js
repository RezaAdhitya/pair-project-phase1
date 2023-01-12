const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

// cart masterlist
router.get('/', Controller.showCart);

// user's cart
router.get('/:cartId', Controller.showCart);

// add cart
router.get('/:productId/addToCart', Controller.addToCart)

// manipulate buying amount
router.get('/:cartId/add', Controller.addAmount);
router.get('/:cartId/sub', Controller.subtractAmount);

// confirm payment
router.get('/:cartId/confirm', Controller.confirmPay);

// delete cart data
router.get('/:cartId/delete', Controller.deleteCart);


module.exports = router;