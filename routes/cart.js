const express = require('express');
const router = express.Router();

// cart masterlist
router.get('/');

// user's cart
router.get('/:userId');

// manipulate buying amount
router.get('/:userId/add');
router.get('/:userId/sub');

// confirm payment
router.get('/:userId/confirm');

// delete cart data
router.get('/:userId/delete');

module.exports = router;