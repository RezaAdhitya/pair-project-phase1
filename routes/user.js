const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();
const { isLoggedIn, isCustomer, isSeller, isAdmin, isCheckingAdminProfile } = require('../middlewares/middleware');

// users list
router.get('/', isAdmin, Controller.listUsers);

// user profile
router.get('/:id', isCheckingAdminProfile, Controller.showProfile);

// edit profile
router.get('/:id/edit', Controller.editProfileForm);
router.post('/:id/edit', Controller.editProfile);

// delete user
router.get('/:id/delete', isAdmin, Controller.deleteUser);

module.exports = router;