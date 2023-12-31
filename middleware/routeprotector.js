const {successPrint, errorPrint} = require("../helpers/debug/debugprinters");

const routeProtectors = {};


routeProtectors.ifUserLoggedIn = function(req, res, next) {
    if(req.session.username) {
        successPrint('User is logged in');
        next();
    }else {
        errorPrint('user is not logged in!');
        req.flash('error', 'User must be logged in to create a post!');
        res.redirect('/login');
    }
}

module.exports = routeProtectors;