//middlewares/auth.js

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        response.redirect('/src/publics/login.html');
    }

    module.exports = isAuthenticated;
}