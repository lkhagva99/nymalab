const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', getUsers);
router.get('/id/:id', getUserById);

module.exports = router; 