const express = require('express');
const { loginUser, registerUser,getUser } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/user/:id', getUser); 

module.exports = router;