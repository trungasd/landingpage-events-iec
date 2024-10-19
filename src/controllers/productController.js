//controllers/productController.js

const Product = require('../models/productModel');

// Hàm thêm sản phẩm mới
async function addProduct(req, res) {
    try {
        const { image, name, price, link } = req.body;
        console.log('Received data:', { image, name, price, link });
        if (!image ||!name ||!price ||!link) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        //Kiem tra dinh dang base64
        if (!image.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image format' });
        }

        const newProduct = new Product({
            image,
            name,
            price,
            link
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch(err){
        console.error('Error adding product:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm cập nhật sản phẩm
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        let { name, price, link } = req.body;

        // Nếu có file ảnh mới
        if (req.file) {
            const imageBuffer = req.file.buffer;
            const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
            req.body.image = base64Image;
        }

        const updateData = {
            name,
            price,
            link,
            image: req.body.image // Nếu có ảnh mới sẽ được cập nhật, nếu không giữ nguyên
        }

        // Tìm và cập nhật
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(updatedProduct);
    }catch(err){
        console.error('Error updating product:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm xóa sản phẩm
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        console.log(id);
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({ message: 'Product not found'});
        }
        res.json({ message: 'Product deleted successfully' });
    }catch(err){
        console.error('Error deleting news:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm lấy tất cả sản phẩm
async function getProduct(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch(err){
        console.error('Error fetching products:', err.message);
        res.status(500).send(err);
    }
}

async function getProductById(req,res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found'});
        }
        res.json(product);
    } catch(err){
        console.error('Error fetching product:', err.message);
        res.status(500).send(err);
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getProductById,  // Thêm hàm getProductById để lấy thông tin sản phẩm theo id
 
};