const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();
const { isLoggedIn, isCustomer, isSeller, isAdmin } = require('../middlewares/middleware');

// cart masterlist
router.get('/', isAdmin, Controller.showCart);

// user's cart
router.get('/:userId', isCustomer, Controller.showCart);

// add cart
router.get('/:productId/addToCart', isCustomer, Controller.addToCart)

// manipulate buying amount
router.get('/:productId/add', Controller.addAmount);
router.get('/:productId/sub', Controller.subtractAmount);

// confirm payment
router.get('/:userId/confirm', isCustomer, Controller.confirmPay);

// delete cart data
router.get('/:productId/delete', isCustomer, Controller.deleteCart);


module.exports = router;