// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/productModel'); // Import model Product từ file product.js
const { addProduct, updateProduct, deleteProduct, getProduct, getProductById } = require('../controllers/productController');
const { handleBase64Image, upload } = require('../middlewares/fileMiddleware');

// API để lấy danh sách sản phẩm


router.post('/product', handleBase64Image, addProduct);
router.put('/product/:id', upload.single('image'), handleBase64Image, updateProduct);
router.delete('/product/:id', deleteProduct);
router.get('/product', getProduct);
router.get('/product/:id', getProductById);

module.exports = router;
