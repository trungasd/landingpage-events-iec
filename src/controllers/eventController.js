//controllers/evetController.js

const Event = require('../models/eventModel');

// Hàm thêm sự kiện mới
async function addEvent(req, res) {
    try {
        const { image, title, content, link} = req.body;

        if (!image ||!title ||!content ||!link) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Kiểm tra định dạng base64
        if (!image.startsWith('data:image')) {
            return res.status(400).json({ message: 'Invalid image format' });
        }

        const newEvent = new Event({ image, title, content, link })
        await newEvent.save();
        res.status(201).json(newEvent);
    }catch (err) {
        console.error('Error adding event:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm cập nhật sự kiện
async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        let { image, title, content, link} = req.body;

        if (req.file) {
            const imageBuffer = req.file.buffer;
            const base64Image = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
            image = base64Image;
        }

        const updateData = { title, content, link, iamge: req.body.image };

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(updatedEvent);
    }catch (err) {
        console.error('Error updating event:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm xóa sự kiện
async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Deleted event successfully' });
    } catch (err) {
        console.error('Error deleting event:', err.message);
        res.status(400).json({ message: err.message });
    }
}

// Hàm lấy danh sách sự kiện
async function getEvent(req, res) {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        console.error('Error fetching events:', err.message);
        res.status(500).json({ message: err.message });
    }
}

// Hàm lấy sự kiện theo id

async function getEventById(req, res) {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error('Error fetching event:', err.message);
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    getEventById,
};