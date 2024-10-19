// routes/newsRoute.js

const express = require('express');
const router = express.Router();
const { addNews, updateNews, deleteNews, getNews, getNewsById } = require('../controllers/newsController');
const { handleBase64Image, upload } = require('../middlewares/fileMiddleware');

// Định nghĩa các endpoints API


router.post('/news', handleBase64Image, addNews);
router.put('/news/:id', upload.single('image'), handleBase64Image, updateNews);
router.delete('/news/:id', deleteNews);
router.get('/news', getNews);
router.get('/news/:id', getNewsById);

module.exports = router;
