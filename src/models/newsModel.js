// models/newsModel.js

const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    image: String,
    title: String,
    content: String,
    link: String,
});

const News = mongoose.model('News', newsSchema);

module.exports = News;