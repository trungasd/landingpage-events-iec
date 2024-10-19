const mongoose = require('mongoose');

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/landingpage', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// Kiểm tra kết nối MongoDB
db.on('error', (err) => {
    console.error('Lỗi kết nối MongoDB:', err);
});
db.once('open', () => {
    console.log('Đã kết nối thành công tới MongoDB!');
});

module.exports = db;
