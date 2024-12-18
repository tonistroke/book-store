const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController');

// Login route
router.post('/login', login);

module.exports = router;
