// models/eventModel.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    link: String,
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;