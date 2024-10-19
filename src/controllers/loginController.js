// controllers/loginController.js
const Login = require('../models/loginModel.js');

async function loginController(req, res) {
    const { username, password } = req.body;

    try {
        const user = await Login.findOne({ username, password });
        if (user) {
            req.session.user = user;
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = loginController ;
