
const express = require('express');
const { register, login, me} = require('../controllers/authController');
const authenticateJWT = require("../middleware/authJWT");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateJWT, me);
module.exports = router;
