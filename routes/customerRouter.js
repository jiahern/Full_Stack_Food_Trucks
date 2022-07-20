const express = require('express')
const passport = require('passport');
const utilities = require("./utility");
require('../config/passport')(passport);

const customerRouter = express.Router()

const menuController = require('../controllers/menuControllers.js')
const customerController = require('../controllers/customerController.js')

// customer sign up
customerRouter.get ('/signup', customerController.signup) 

// customer login
customerRouter.get ('/login', customerController.login)  

// customer submit sign up form
customerRouter.post ('/signup', passport.authenticate('local-signup',{
    successFlash: true,
    successRedirect: '/customer/menu',
    failureFlash: true,
    failureRedirect: '/customer/signup',
}))

// customer submit login form
customerRouter.post ('/login', passport.authenticate('local-login',{
    successFlash: true,
    successRedirect: '/customer/menu',
    failureFlash: true,
    failureRedirect: '/customer/login',
}))

// index page: show the map
customerRouter.get('/',customerController.showMap);

//menu page
customerRouter.get('/menu', menuController.getMenu);
customerRouter.get('/menu/:vanID', menuController.getMenu);
customerRouter.get('/menu/item/:name', menuController.getDescription)

// add an item to the order
customerRouter.post('/addToCart', utilities.isLoggedIn, customerController.addToCart)

//show the cart , a list of added items
customerRouter.get('/cart',utilities.isLoggedIn, customerController.getCart)

//items quantity manipulation
customerRouter.get('/reduceQuan/:itemID',utilities.isLoggedIn,customerController.reduceQuan)
customerRouter.get('/increaseQuan/:itemID',utilities.isLoggedIn,customerController.increaseQuan)

// get customer's current ongoing (not placed) order
customerRouter.get('/customerOngoingOrder',utilities.isLoggedIn,customerController.getCustomerOngoingOrder)

// confirm customer's order, status from ongoing to fulfilling
customerRouter.get('/confirmOrder',utilities.isLoggedIn,customerController.confirmOrder)

// users add note to their ongoing order
customerRouter.post('/editNote',utilities.isLoggedIn,customerController.editNote)

// get customer's current placed order
customerRouter.get('/customerPlacedOrder',utilities.isLoggedIn,customerController.getCustomerPlacedOrder)

//change or cancel the placed & fulfilling order
customerRouter.get('/changeOrder',utilities.isLoggedIn, customerController.changeOrder)
customerRouter.get('/cancelOrder',utilities.isLoggedIn, customerController.cancelOrder)

// get customer's past orders
customerRouter.get('/customerPastOrder',utilities.isLoggedIn,customerController.getCustomerPastOrders)

// get the specific customer's past orders
customerRouter.get('/pastOrderDetails/:orderID',utilities.isLoggedIn,customerController.getOnePastOrder)

// customer comment a order
customerRouter.post('/rateOrder/:orderID',utilities.isLoggedIn,customerController.rateOrder)

// customer profile page
customerRouter.get('/profile',utilities.isLoggedIn,customerController.getProfile)

// customer change info
customerRouter.post('/changeUserInfo',utilities.isLoggedIn,customerController.changeUserInfo)

// customer change password
customerRouter.post('/changeUserPassword',utilities.isLoggedIn,customerController.changeUserPassword)

customerRouter.get('/logout', function(req, res) {
    req.logout();
    req.flash('');
    res.redirect('/customer/');
});
module.exports = customerRouter