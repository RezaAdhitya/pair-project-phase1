const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();

// users list
router.get('/', Controller.listUsers);

// user profile
router.get('/:id', Controller.showProfile);

// edit profile
router.get('/:id/edit', Controller.editProfileForm);
router.post('/:id/edit', Controller.editProfile);

// delete user
router.get('/:id/delete', Controller.deleteUser);

module.exports = router;