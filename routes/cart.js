const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

// cart masterlist
router.get('/', Controller.showCart);

// user's cart
router.get('/:userId', Controller.showCart);

// manipulate buying amount
router.get('/:userId/add');
router.get('/:userId/sub');

// confirm payment
router.get('/:userId/confirm');

// delete cart data
router.get('/:userId/delete');

module.exports = router;