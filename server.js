const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/config/db'); // Import module kết nối MongoDB từ file db.js
const Product = require('./src/models/productModel'); // Import model Product từ file product.js
const productRoutes = require('./src/routes/productRouter');
const newsRoutes = require('./src/routes/newsRoute');
const eventRoute = require('./src/routes/eventRoute');
const loginRoute = require('./src/routes/loginRoute');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Serve static files từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Tăng giới hạn kích thước cho các yêu cầu JSON và urlencoded
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Cấu hình session
app.use(session({
    secret: 'chuoibimatcuahohuynhtrung',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));

app.use('/api', productRoutes);
app.use('/api', newsRoutes);
app.use('/api', eventRoute);
app.use('/api', loginRoute);



app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});
