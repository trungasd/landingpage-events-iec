//controllers/newsController.js

const News = require('../models/newsModel');

// Hàm thêm tin tức mới
async function addNews(req, res) {
    try {
        const { image, title, content, link } = req.body;
        if (!image || !title || !content || !link) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Kiểm tra định dạng base64
        if (!image.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image format' });
        }

        const newNews = new News({ image, title, content, link });
        await newNews.save();
        res.status(201).json(newNews);
    } catch (err) {
        console.error('Error adding news:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm cập nhật tin tức
async function updateNews(req, res) {
    try {
        const { id } = req.params;
        let { title, content, link } = req.body;
        
        // Nếu có file ảnh mới
        if (req.file) {
            const imageBuffer = req.file.buffer;
            const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
            req.body.image = base64Image;
        }

        const updatedData = {
            title,
            content,
            link,
            image: req.body.image // Nếu có ảnh mới, sẽ được cập nhật, nếu không, giữ nguyên
        };

        // Tìm và cập nhật
        const updatedNews = await News.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedNews) {
            return res.status(404).json({ message: 'News not found' });
        }

        res.json(updatedNews);
    } catch (err) {
        console.error('Error updating news:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm xóa tin tức
async function deleteNews(req, res) {
    try {
        const { id } = req.params;
        const deletedNews = await News.findByIdAndDelete(id);
        if (!deletedNews) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json({ message: 'Deleted news successfully' });
    } catch (err) {
        console.error('Error deleting news:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm lấy danh sách tin tức
async function getNews(req, res) {
    try {
        const news = await News.find();
        res.json(news);
    } catch (err) {
        console.error('Error fetching news:', err.message);
        res.status(500).json({ message: err.message });
    }
}

async function getNewsById(req, res) {
    try {
        const { id } = req.params;
        const news = await News.findById(id);
        if (!news) {
            return res.status(404).json({ message: ' News not found'});
        }
        res.json(news);
    } catch (err) {
        console.error('Error fetching news:', err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addNews,
    updateNews,
    deleteNews,
    getNews,
    getNewsById
};
