const express = require('express');
const { getProducts, createProduct, updateProduct,getProductsById } = require( '../controllers/productController.js')
const authenticateJWT = require('../middleware/authJWT.js');
const {getStock, updateStock} = require("../controllers/productController");

const router = express.Router();

router.get('/', getProducts);
router.post('/', authenticateJWT, createProduct);
router.put('/:id', authenticateJWT, updateProduct);
router.get('/:id', getProductsById);
router.get('/s/:id', getStock);
router.put('/s/:id', authenticateJWT, updateStock);
module.exports = router;
