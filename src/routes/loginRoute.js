const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const isAuthenticated = require('../middlewares/auth');

router.post('/login', loginController);

module.exports = router;
