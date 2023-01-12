const express = require('express');
const router = express.Router();

// users list
router.get('/');

// user profile
router.get('/:id');

// edit profile
router.get('/:id/edit');
router.post('/:id/edit');

// delete user
router.get('/:id/delete');

module.exports = router;