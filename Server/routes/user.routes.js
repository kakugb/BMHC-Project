const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const checkAdminRole = require('../middlewares/checkRole.js');

router.post('/register', userController.registerUser);


router.post('/login', userController.loginUser);

module.exports = router;
