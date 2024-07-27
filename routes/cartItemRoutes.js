const express = require("express");
const authenticateJWT = require('../middleware/authJWT.js');
const {getCartProducts} = require("../controllers/cartItemController");
const {getCartItemsById} = require("../controllers/cartItemController");
const {createCartItem} = require("../controllers/cartItemController");
const {updateCartItem} = require("../controllers/cartItemController");
const {deleteCartItem} = require("../controllers/cartItemController");


const router = express.Router();

router.get('/:cartId', authenticateJWT, getCartProducts);
router.get('/:cartId/p/:productId', authenticateJWT, getCartItemsById);
router.post('/:cartId', authenticateJWT,createCartItem);
router.put('/:cartId/', authenticateJWT,updateCartItem);
router.delete('/:cartId/p/:productId', authenticateJWT,deleteCartItem);
module.exports = router;
