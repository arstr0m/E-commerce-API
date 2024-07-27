const express = require('express');
const {checkout} = require( '../controllers/checkoutController')
const authenticateJWT = require('../middleware/authJWT.js');

const router = express.Router();

router.post('/checkout', authenticateJWT, checkout);


module.exports = router;
