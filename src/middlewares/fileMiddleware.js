const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024}
});

function handleBase64Image(req, res, next) {
    if (req.body.image && !req.body.image.startsWith('data:image')) {
        return res.status(400).json({ message: 'Invalid image format' });
    }
    next();
}

module.exports = {
    upload,
    handleBase64Image
};
