const express = require('express');
const {getCarts,createCart,getCartsById,deleteCart, getUserCar} = require( '../controllers/cartController')
const authenticateJWT = require('../middleware/authJWT.js');

const router = express.Router();

router.get('/all', authenticateJWT, getCarts);
router.get('/:id', authenticateJWT, getCartsById);
router.delete('/:id', authenticateJWT,deleteCart);
router.post('/create', authenticateJWT,createCart);
router.get('/', authenticateJWT,getUserCar);

module.exports = router;
