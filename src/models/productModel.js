const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm
const productSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: String,
    link: String,
});

// Tạo model 'Product' từ schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
