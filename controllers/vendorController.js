// connect to Mongoose model
const mongoose = require("mongoose")
// const Van = mongoose.model("Van")
// const Order = mongoose.model("Order")
// const User = mongoose.model("User")
const Van = require("../models/van")
const Order = require("../models/order")
const User = require("../models/user")

// get express-validator, to validate user data in forms
// const expressValidator = require('express-validator')

//login page
const login = async (req,res) => {
    res.render('V_login', {layout: false})
}

const vendorHome = async (req,res) => {
    const vanID = req.session.passport.user
    try {
        const van = await 
        Van.findOne( {"_id": vanID})
        
        res.render('V_home',{"vanStatus":van.status,"vanID":van.name})
          
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const closeVanPage = async (req,res) => {
    res.render('V_close', {layout: false})
}




// Submit button with entering address and open business
const setVanStatus = async (req, res) => {
    // store the argument from the requirement in new_van
    const vanID = req.session.passport.user
    const textLocation = req.body.textLocation // note content
    const longitudeLocation = req.body.longitude
    const latitudeLocation = req.body.latitude
    const geolocation = {
        Latitude: latitudeLocation,
        Longitude: longitudeLocation
    }
    try {
        // find the aimed van from the database
        const van = await Van.findOne( {"_id": vanID} ) 
        if (!van) {   
            // catch error if the aimed van is not in the database
            res.status(400)
            return res.send("van not found in database")
        }

        //Update the van to ready-for-orders and text Location
        await Van.findOneAndUpdate({"_id": vanID},{$set: { "status":"ready-for-orders", "textLocation": textLocation, "geolocation":geolocation} })
    

        res.redirect('/vendor/home')
         
    } catch (err) {
        // detect error
        res.status(400)
        return res.send("Database update failed")
    }
}


//Update Van Status to Open
const openVan = async (req,res) => {
    const vanID = req.session.passport.user
    
    try{
        //Determine whether the requested vanName is in the database
        const vanStatus = await Van.findOne( {"_id": vanID})
        if(vanStatus=== null){
            res.status(400)
            return res.send("Van name not found in database")
        }
        
        //Filter out the right vanName, then change the status
        //await Van.findOneAndUpdate({"_id": vanID},{"status":"ready-for-orders"})
        res.redirect('/vendor/home')
        //return;
    }catch(err) {   //error occured
        res.status(400)
        return res.send("Update Van Status Query failed")
    }
}

//Update Van Status to Close
const closeVan = async (req,res) => {
    const vanID = req.session.passport.user
    
    try{
        //Determine whether the requested vanName is in the database
        const vanStatus = await Van.findOne( {"_id": vanID})
        if(vanStatus=== null){
            res.status(400)
            return res.send("Van name not found in database")
        }
        
        //Filter out the right vanName, then change the status
        await Van.findOneAndUpdate({"_id": vanID},{"status":"closed"})
        res.redirect('/vendor/home')
        
    }catch(err) {   //error occured
        res.status(400)
        return res.send("Update Van Status Query failed")
    }
}


// Order related functions

// get all fulfilling and fulfilled orders
const getAllOutstandingOrders = async (req,res) => {


    try {
        const outstandingOrders 
        = await Order.find({ $or: [ {status : "fulfilling"},{status: "fulfilled"}]})
                    .populate("items._itemID")
        return res.send(outstandingOrders)
    }catch(err) {
        res.status(400)
        return res.send("Database query failed")
    }

}



const getAllFulfilledOrders = async (req,res) => {
    const vanID = req.session.passport.user
    try {

        //Determine whether the requested vanName is in the database
        const vanStatus = await Van.findOne( {"_id": vanID})
        if(vanStatus=== null){
            res.status(400)
            return res.send("Van name not found in database")
        }

        const fulfilledOrders 
        = await Order.find({$and :[{"_vanID": vanID},{"status":"fulfilled" }]})
                    .populate("items._itemID").lean()
        res.render('V_fulfilled',{"vendorOrders": fulfilledOrders}) 
    }catch(err) {
        res.status(400)
        return res.send("Database query failed")
    }

}




const getAllCompletedOrders = async (req,res) => {
    const vanID = req.session.passport.user
    try {
        //Determine whether the requested vanName is in the database
        const vanStatus = await Van.findOne( {"_id": vanID})
        if(vanStatus=== null){
            res.status(400)
            return res.send("Van name not found in database")
        }

        const completedOrders 
        = await Order.find({$and :[{"_vanID": vanID},{"status":"complete" }]})
                    .populate("items._itemID").lean()
        res.render('V_complete',{"vendorOrders": completedOrders}) 
    }catch(err) {
        res.status(400)
        return res.send("Database query failed")
    }

}



// Update fulfilled order to complete
const completeOrder = async (req,res) => {
    const orderID = req.body.orderID
    try{
        //Check whether the orderID is in the database
        const OrderStatus = await Order.findOne( {"orderID": orderID})
        if(OrderStatus=== null){
            res.status(400)
            return res.send("Order not found in database")
        }
        //Filter the right order, then change to fulfilled
         await Order.findOneAndUpdate({"orderID": orderID},{status:"complete"})
         return res.send("Update Order Status Succesful")

    }catch(err) {   //error occured
        res.status(400)
        return res.send("Update Database Query failed")
    }
}

const lookupFulfillingOrder = async (req, res) => {
    const vanID = req.session.passport.user;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try {
        const customer = await User.findOne({$and :[{"firstname": firstName},{"lastname": lastName }]}).lean()
        if (customer === null) {
            res.status(400)
            return res.send("Customer was not found in database.")
        }
        const customerID = customer._id

        const orderResult = await Order.find({$and :[{"_customerID": customerID},{"_vanID": vanID._id},{"status": "fulfilling"}]})
        .populate("_customerID").populate("items._itemID").lean()
        
        if (orderResult === null) {
            res.status(400)
            return res.send("No fulfilling order was found in database.")
        }
        res.render('V_fulfilling',{"orders": orderResult}) 

    }catch(err) {
        res.status(400)
        return res.send("Database query failed")
    }
}

const lookupFulfilledOrder = async (req, res) => {
    const vanID = req.session.passport.user;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try {
        const customer = await User.findOne({$and :[{"firstname": firstName},{"lastname": lastName }]}).lean()
        if (customer === null) {
            res.status(400)
            return res.send("Customer was not found in database.")
        }
        const customerID = customer._id

        const orderResult = await Order.find({$and :[{"_customerID": customerID},{"_vanID": vanID._id},{"status": "fulfilled"}]})
        .populate("_customerID").populate("items._itemID").lean()

        if (orderResult === null) {
            res.status(400)
            return res.send("No fulfilled order was found in database.")
        }
        res.render('V_fulfilled',{"orders": orderResult}) 

    }catch(err) {
        res.status(400)
		console.log(err)
        return res.send("Database query failed")
    }
}

const lookupCompleteOrder = async (req, res) => {
    const vanID = req.session.passport.user;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    try {
        const customer = await User.findOne({$and :[{"firstname": firstName},{"lastname": lastName }]}).lean()
        if (customer === null) {
            res.status(400)
            return res.send("Customer was not found in database.")
        }
        const customerID = customer._id

        const orderResult = await Order.find({$and :[{"_customerID": customerID},{"_vanID": vanID._id},{"status": "complete"}]})
        .populate("_customerID").populate("items._itemID").lean()

        if (orderResult === null) {
            res.status(400)
            return res.send("No complete order was found in database.")
        }
        res.render('V_complete',{"orders": orderResult}) 

    }catch(err) {
        res.status(400)
        return res.send("Database query failed")
    }
}



const getCustomerFulfillingOrders = async (req,res) => {
    const vanID = req.session.passport.user
    try {
        
        const orders = await 
        Order.find( {$and :[{"_vanID": vanID},{"status":"fulfilling"}]}).sort({ "orderTime": 1 })
        .populate("_customerID").populate("items._itemID").lean()
        if(orders === null){
            res.render('V_noFulfilling')
        }else{
            res.render('V_fulfilling',{"orders":orders})
        }   
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getCustomerFulfilledOrders = async (req,res) => {
    const vanID = req.session.passport.user
    try {
        const orders = await 
        Order.find( {$and :[{"_vanID": vanID},{"status":"fulfilled"}]}).sort({ "orderTime": 1 })
        .populate("_customerID").populate("items._itemID").sort({date: 'ascending'}).lean()
        if(orders === null){
            res.render('V_noFulfilled')
        }else{
            res.render('V_fulfilled',{"orders":orders})
        }   
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getCustomerCompleteOrders = async (req,res) => {
    const vanID = req.session.passport.user
    try {
        
        const orders = await 
        Order.find( {$and :[{"_vanID": vanID},{"status":"complete"}]}).sort({ "orderTime": 1 })
        .populate("_customerID").populate("items._itemID").sort({date: 'ascending'}).lean()
        if(orders === null){
            res.render('V_noComplete')
        }else{
            res.render('V_complete',{"orders":orders})
        }   
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getOneFulfillingOrder = async (req,res) => {
    const orderID = req.params.orderID

    try {
        const fulfillingOrder = await 
        Order.findOne({"_id":orderID})
        .populate("_customerID").populate("items._itemID").lean() // find the past order
        let orderDate = fulfillingOrder.orderTime
        var stringDate =  orderDate.toLocaleString()
        
        //Calculate total Time Remaining
        let current_time = new Date(orderDate)
        let p_current_time = current_time.getTime()
        let discountDuration = parseInt(process.env.DISCOUNT_TIME)
        let totalTime = Math.abs(p_current_time + discountDuration)

        res.render('V_oneFulfilling',{"thisOrder":fulfillingOrder,"orderDate":stringDate,"oneOrderID":orderID, discountLeftTime:totalTime}) //render page
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getOneFulfilledOrder = async (req,res) => {
    const orderID = req.params.orderID
    try {
        
        const fulfillingOrder = await 
        Order.findOne({"_id":orderID})
        .populate("_customerID").populate("items._itemID").lean() // find the past order
        let orderDate = fulfillingOrder.orderTime
        var stringDate =  orderDate.toLocaleString()
        
        res.render('V_oneFulfilled',{"thisOrder":fulfillingOrder,"orderDate":stringDate,"oneOrderID":orderID}) //render page
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getOneCompleteOrder = async (req,res) => {
    const orderID = req.params.orderID
    try {
        const fulfillingOrder = await 
        Order.findOne({"_id":orderID})
        .populate("_customerID").populate("items._itemID").lean() // find the past order
        let orderDate = fulfillingOrder.orderTime
        var stringDate =  orderDate.toLocaleString()
        
        res.render('V_oneComplete',{"thisOrder":fulfillingOrder,"orderDate":stringDate}) //render page
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

// Update fulfilling order to fulfilled
const updateToFulfilled = async (req,res) => {
    const orderID = req.params.orderID
    
    try{
        //Check whether the orderID is in the database
        const OrderStatus = await Order.findOne({$and :[{"_id": orderID},{"status":"fulfilling"}]})
        if(OrderStatus=== null){
            res.status(400)
            return res.send("Order not found in database")
        }
        //Filter the right order, then change to fulfilled
         await Order.findOneAndUpdate({"_id": orderID},{"status":"fulfilled"})
         res.redirect('/vendor/fulfilling')

    }catch(err) {   //error occured
        res.status(400)
        return res.send("Update Database Query failed")
    }
}

// Update fulfilling order to fulfilled
const updateToCompleted = async (req,res) => {
    const orderID = req.params.orderID
    
    try{
        //Check whether the orderID is in the database
        const OrderStatus = await Order.findOne({$and :[{"_id": orderID},{"status":"fulfilled" }]})
        if(OrderStatus=== null){
            res.status(400)
            return res.send("Order not found in database")
        }
        //Filter the right order, then change to fulfilled
         await Order.findOneAndUpdate({"_id": orderID},{"status":"complete"})
         res.redirect('/vendor/fulfilled')

    }catch(err) {   //error occured
        res.status(400)
        return res.send("Update Database Query failed")
    }
}


module.exports = {
    login,
    vendorHome,
    setVanStatus,
    openVan,
    closeVan,
    closeVanPage,
    getAllOutstandingOrders, 
    getAllFulfilledOrders, 
    getAllCompletedOrders, 
    updateToFulfilled, 
    updateToCompleted,
    lookupFulfillingOrder,
    lookupFulfilledOrder,
    lookupCompleteOrder,
    getCustomerFulfillingOrders,
    getCustomerFulfilledOrders,
    getCustomerCompleteOrders,
    getOneFulfillingOrder,
    getOneFulfilledOrder,
    getOneCompleteOrder


}
