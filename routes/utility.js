// middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        if(req.session.passport.user.role === "customer"){
            return next();
        }
    }
    // if not logged in, redirect to login form
    res.render('protected')
}

function isLoggedIn_V(req, res, next) {
    if (req.isAuthenticated()){
        if(req.session.passport.user.role === "van"){
            return next();
        }
    }
    // if not logged in, redirect to login form
    res.render('V_login')
}


module.exports = {
    isLoggedIn,
    isLoggedIn_V
}