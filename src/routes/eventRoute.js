//  routes/eventRoute.js

const express = require('express');
const router = express.Router();
const { addEvent, updateEvent, deleteEvent, getEvent, getEventById } = require('../controllers/eventController');
const { handleBase64Image, upload } = require('../middlewares/fileMiddleware');


router.post('/event', handleBase64Image, addEvent);
router.put('/event/:id', upload.single('image'), handleBase64Image, updateEvent);
router.delete('/event/:id', deleteEvent);
router.get('/event', getEvent);
router.get('/event/:id', getEventById);

module.exports = router;