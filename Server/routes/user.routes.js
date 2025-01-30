const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');



router.post('/register', userController.registerUser);


router.post('/login', userController.loginUser);


router.get('/getAllUser', userController.getAllUsers);


router.get('/getUser/:id', userController.getUserById);


router.put('/updateUser/:id', userController.updateUser);


router.delete('/deleteUser/:id', userController.deleteUser);

module.exports = router;

