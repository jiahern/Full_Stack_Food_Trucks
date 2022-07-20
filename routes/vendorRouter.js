const express = require('express');
const utilities = require("./utility");
const passport = require('passport');
require('../config/passport')(passport);

const vendorRouter = express.Router();

// express-validator, to validate user data in forms
// const expressValidator = require('express-validator')

// require the controllers
const vendorController = require('../controllers/vendorController')

// GET the login page
vendorRouter.get('/', (req, res) => vendorController.login(req, res))

// POST the login form
vendorRouter.post('/', passport.authenticate('vendor-local-login', {
    successFlash: true,
    successRedirect : '/vendor/home', // redirect to vendor homepage
    failureFlash : true, // allow flash messages
    failureRedirect : '/vendor/' // redirect to login page
}))


// GET the vendor homepage
vendorRouter.get('/home', utilities.isLoggedIn_V, vendorController.vendorHome)


// Van status related routes


// Set the van status to ready-for-orders
vendorRouter.get('/openVan', utilities.isLoggedIn_V, vendorController.openVan)

// Direct to close page
vendorRouter.get('/closeVanPage', utilities.isLoggedIn_V, vendorController.closeVanPage)

// Set the van status to closed
vendorRouter.post('/closeVan', utilities.isLoggedIn_V, vendorController.closeVan)

// handle the POST request update the van's data(including location and status)
vendorRouter.post('/setVanStatus', utilities.isLoggedIn_V, vendorController.setVanStatus)


// Order related routes
// get all fulfilling orders of this van
vendorRouter.get('/fulfilling', utilities.isLoggedIn_V, vendorController.getCustomerFulfillingOrders)

// lookup all fulfilling orders of the customer
vendorRouter.post('/fulfilling/lookup', utilities.isLoggedIn_V, (req, res) => vendorController.lookupFulfillingOrder(req, res))

// get all fulfilled orders of this van
vendorRouter.get('/fulfilled', utilities.isLoggedIn_V,vendorController.getCustomerFulfilledOrders)

// lookup all fulfilled orders of the customer
vendorRouter.post('/fulfilled/lookup', utilities.isLoggedIn_V, (req, res) => vendorController.lookupFulfilledOrder(req, res))

// get all complete orders of this van
vendorRouter.get('/complete', utilities.isLoggedIn_V,vendorController.getCustomerCompleteOrders)

// lookup all complete orders of the customer
vendorRouter.post('/complete/lookup', utilities.isLoggedIn_V, (req, res) => vendorController.lookupCompleteOrder(req, res))



// get all fulfilling orders of this van
vendorRouter.get('/fulfillingDetails/:orderID',utilities.isLoggedIn_V, vendorController.getOneFulfillingOrder)

// get all fulfilling orders of this van
vendorRouter.get('/fulfilledDetails/:orderID',utilities.isLoggedIn_V, vendorController.getOneFulfilledOrder)

// get all fulfilling orders of this van
vendorRouter.get('/completeDetails/:orderID',utilities.isLoggedIn_V, vendorController.getOneCompleteOrder)



// Update fulfilling order to fulfilled
vendorRouter.post('/updateToFulfilled/:orderID', utilities.isLoggedIn_V,vendorController.updateToFulfilled)

// Update fulfilled order to complete
vendorRouter.post('/updateToCompleted/:orderID', utilities.isLoggedIn_V,vendorController.updateToCompleted)



// get a list of all outstanding orders (i.e. fulfilling and fulfilled)
vendorRouter.get('/allOutstandingOrders', utilities.isLoggedIn_V, vendorController.getAllOutstandingOrders)

// vendor log out
vendorRouter.get('/logout', utilities.isLoggedIn_V, function(req, res) {
    vendorController.closeVan(req, res);
    req.logout();
    req.flash('');
    res.redirect('/vendor/');
});

module.exports = vendorRouter