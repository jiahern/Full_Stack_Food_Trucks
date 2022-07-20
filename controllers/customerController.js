const mongoose = require("mongoose")
const Order = mongoose.model("Order")
const User = mongoose.model("User")
const Van = mongoose.model("Van")
const Food = mongoose.model("Food")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { all } = require("../routes/customerRouter")

//sign up page
const signup = (req,res) => {
    const message = req.flash("signupMessage")
    res.render('signup', {layout: false,message: message})
}

//login page
const login = (req,res) => {
    const message = req.flash("loginMessage")
    res.render('login', {layout: false, message: message})
}

// index page, show the map (w/ a list of vans) or redirect to others pages
const showMap = async (req,res) => {
    // if the user is logged in, check if he has an ongoing/processing order
    if (req.isAuthenticated()){
        const customerID = req.session.passport.user._id
        const ongoingOrder = await Order.findOne( {$and :[{"status": "ongoing"},{"_customerID": customerID}]}).lean() // try to find ongoing order
        if (ongoingOrder !== null) { // if the user has ongoing order, continue the ongoing order
            req.session.vanID = ongoingOrder._vanID
            res.redirect('/customer/menu')
        }

        const processingOrder = await // try to find processing (fulfilling/fulfilled) order
        Order.findOne( {$and :[{$or : [ {"status": "fulfilled"},{"status" : "fulfilling"}] },{"_customerID": customerID}]}).lean()
        if (processingOrder !== null) { // if the user has processing order, redirect to the order status page
            req.session.vanID = processingOrder._vanID
            res.redirect('/customer/customerPlacedOrder')
        }

    }
    await Van.find({status:"ready-for-orders"}, function(err, vans) { // find a list of vans, show the nearest 5 on the map
        var allVans = []; 
        vans.forEach(function(van) {
            allVans.push(van)
        });  
        res.render('map',{ 
            allVans : encodeURIComponent(JSON.stringify(allVans)),
            layout: false
          })
      });

}


const addToCart = async (req, res) => {
    // get all essential information for adding to the cart from the req
    const customerID = req.session.passport.user._id
    const item = req.body
    const itemDB = await Food.findOne( {$and :[{"size": item.size},{"sugar":item.sugar},{"ice":item.ice},{"name":item.foodName}]}) 
    const itemID = itemDB._id;

    try {
        // look for the customer's ongoing order
        const order = await Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]})
        // check if the ongoing order exists
        if(order === null){// if not, create a new order
            // orderID: created based on the vanID and customerID
            const _vanID = req.session.vanID
            const vanSub = _vanID.slice(-2)
            const newOrderID = vanSub.concat(customerID.slice(-3))
            const new_order = new Order({ //new order
                orderID: newOrderID,
                _customerID : customerID,
                status: "ongoing",
                items : [{_itemID: itemID, quantity: 1}],
                _vanID : _vanID
            })
            try {
                await new_order.save()
                res.redirect('/customer/menu')         
            } catch (err) {   // error detected
                console.log(err)
                return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
            }
        } else {
            // there is an ongoing order, update it
            // check if the food is in the order
            var found = 0
            for (var i = 0; i < order.items.length; i++) {
                // if the item is in the order
                if (JSON.stringify(order.items[i]._itemID)===JSON.stringify(itemID)) {
                    order.items[i].quantity = order.items[i].quantity+1
                    await order.save()
                    found = 1
                    break
                }
            }
            // if the item is not in the order, add as new
            if (found === 0){
                const new_item = {_itemID: itemID, quantity: 1}
                const allItems = order.items
                allItems.push(new_item)
                order.items = allItems
                await order.save()
            }
        }
        res.redirect('/customer/menu')
    } catch (err) {   // error detected
        console.log(err)
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

//reduce the quantity of an item in the cart
const reduceQuan = async (req,res) => {
    const itemID = req.params.itemID
    const customerID = req.session.passport.user._id
    try {
        // look for the customer's ongoing order
        const order = await Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]})
     
        // find the food in the order
        for (var i = 0; i < order.items.length; i++) {
            if (JSON.stringify(order.items[i]._itemID)===JSON.stringify(itemID)) {
                order.items[i].quantity = order.items[i].quantity-1 //reduce
                if (order.items[i].quantity <= 0){//if reduce to 0, remove the item
                    order.items.pull({_id:order.items[i]._id})
                }
                if(order.items.length <=0){ //if no item in the order, delete the order
                    await order.delete()
                }else{
                    await order.save() //otherwise, save to the DB
                }
                break
            }
        }   
        res.redirect('/customer/cart')      
    } catch (err) {   // error detected
        console.log(err)
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
    
}

//increase the quantity of an item in the cart
const increaseQuan = async (req,res) => {
    const itemID = req.params.itemID
    const customerID = req.session.passport.user._id
    try {
        // look for the customer's ongoing order
        const order = await Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]})
     
        // find the food in the order
        for (var i = 0; i < order.items.length; i++) {
            if (JSON.stringify(order.items[i]._itemID)===JSON.stringify(itemID)) {
                order.items[i].quantity = order.items[i].quantity+1 //quantity add 1
                await order.save()
                break
            }
        }
        res.redirect('/customer/cart')   
    } catch (err) {   // error detected
        console.log(err)
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

//cart page
const getCart = async (req,res) => {
    const customerID = req.session.passport.user._id
    const order = await //get the ongoing order
        Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]})
        .populate("_vanID").populate("items._itemID").lean()
    if (order !== null){ //if there is a order, show the cart
        res.render('cart',{"thisOrder":order})
    }else{//otherwise, show emptycart page
        res.render('emptyCart')
    }

}


const getCustomerOngoingOrder = async (req,res) => { 
    const customerID = req.session.passport.user._id
    try {
        const order = await 
        Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]})
        .populate("_vanID").populate("items._itemID").lean() // find the ongoing order
        if(order === null){     
            res.redirect('/customer/customerPlacedOrder') // if not find the ongoing order, jump to placedOrder
        }
        res.render('confirmPage',{"thisOrder":order}) //render page
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const confirmOrder = async (req, res) => {
    const customerID = req.session.passport.user._id 
    try {
        // find the ongoing order
        const order = await Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]}).populate("items._itemID")
        if(order === null){
            res.status(400)
            return res.send("No ongoing order for this customer")
        }
        //calculate total price
        const items = order.items
        var price = 0
        for (var i = 0, j = items.length; i < j; i++){
            var singlePrice = items[i]._itemID.singlePrice
            var quantity = items[i].quantity
            var subtotal = singlePrice*quantity
            price += subtotal
        }
        //update price, status and order time
        await Order.findOneAndUpdate({$and :[{"_customerID": customerID},{"status":"ongoing" }]},{$set:{status:"fulfilling",subTotal: price, totalPrice: price, orderTime: Date.now()}})
        res.redirect('/customer/customerPlacedOrder')  // go to the status pages      
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const editNote = async (req,res) => {
    const customerID = req.session.passport.user._id
    const note = req.body.note // note content
    try {
        const order = await Order.findOne( {$and :[{"_customerID": customerID},{"status":"ongoing" }]})
        if(order === null){
            return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
        }
        await Order.updateOne({$and :[{"_customerID": customerID},{"status":"ongoing"}]},{$set: {"note": note}}) // update the order note
        res.redirect('/customer/customerOngoingOrder')
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}


const getCustomerPlacedOrder = async (req,res) => {
    const customerID = req.session.passport.user._id
    try {
        //find the fulfilling or fulfilled order
        var order = await 
        Order.findOne( {$and :[{$or : [ {"status": "fulfilled"},{"status" : "fulfilling"}] },{"_customerID": customerID}]})
        .populate("_vanID").populate("items._itemID").lean()
        if(order === null){
            res.render('noPlacedOrder')
        }else{
            //Change the orderTime format from ISO to readable format.
            let orderDate = order.orderTime
            var stringDate =  orderDate.toLocaleString()
            
            //Set the condition when status is "fulfilled", it will present "Waiting For Pickup"
            let orderStatus = order.status
            // check if the order can be changed or cancelled
            var changeable = true
            var newOrderStatus = ""
            if(orderStatus === "fulfilled"){ // if fulfilled, not changeable
                changeable = false
                newOrderStatus = "Waiting For Pickup"     
            }else{
                newOrderStatus = orderStatus
            }
            // time elapsed from ordering
            var currentTime = new Date()
            var timeDuration = Math.abs(currentTime.getTime() - orderDate.getTime());
            if (timeDuration>process.env.MODIFY_TIME){ // over 10 mins, not changeable
                changeable = false
            }
            // check if the discount need to be applied
            if (timeDuration>process.env.DISCOUNT_TIME && orderStatus === "fulfilling"){
                order.totalPrice = parseFloat(order.subTotal*process.env.DISCOUNT).toFixed(2); 
                await Order.updateOne({$and :[{$or : [ {"status": "fulfilled"},{"status" : "fulfilling"}] },{"_customerID": customerID}]},{"totalPrice":order.totalPrice})        
            }
                //render the placedOrderDetail HBS and hold few variables    
            res.render('placedOrderDetails',{"customerID": customerID, "thisOrder":order,"orderDate":stringDate,"orderStatus":newOrderStatus,"changeable":changeable})   
        }

    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const changeOrder = async (req,res) => {
    const customerID = req.session.passport.user._id
    try {
        // find the fulfilling order, if not found(status ===fulfilled), redirect back to status page
        const order = await Order.findOne( {$and :[{"status" : "fulfilling"},{"_customerID": customerID}]}).lean()
        if(order === null){
            return res.redirect('/customer/customerPlacedOrder')
        }
        //get time duration
        var orderDate = order.orderTime
        var currentTime = new Date()
        var timeDuration = Math.abs(currentTime.getTime() - orderDate.getTime());
        if (timeDuration>process.env.MODIFY_TIME){ // if time duration over 10 mins, back to status page
            res.redirect('/customer/customerPlacedOrder')
        }else{
            // otherwise, change status to ongoing and jump to the menu page
            await Order.findOneAndUpdate({$and :[{"status" : "fulfilling"},{"_customerID": customerID}]},{"status":"ongoing"})
            res.redirect('/customer/menu')
        }
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const cancelOrder = async (req,res) => {
    const customerID = req.session.passport.user._id
    try {
        // find the fulfilling order, if not found (status ===fulfilled), redirect back to status page
        const order = await Order.findOne( {$and :[{"status" : "fulfilling"},{"_customerID": customerID}]}).lean()
        if(order === null){
            return res.redirect('/customer/customerPlacedOrder')
        }
        //get time duration
        var orderDate = order.orderTime
        var currentTime = new Date()
        var timeDuration = Math.abs(currentTime.getTime() - orderDate.getTime());
        if (timeDuration>process.env.MODIFY_TIME){// if time duration over 10 mins, back to status page
            res.redirect('/customer/customerPlacedOrder')
        }else{
            //delete the order and back to the map page
            await Order.findOneAndUpdate({$and :[{"status" : "fulfilling"},{"_customerID": customerID}]},{"status":"cancelled"})
            res.redirect('/customer')
        }

    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
    
}


const getCustomerPastOrders = async (req,res) => {
    const customerID = req.session.passport.user._id
    try {
        const orders = await 
        Order.find( {$and :[{"_customerID": customerID},{"status":"complete"}]})
        .populate("_vanID").populate("items._itemID").lean()
        if(orders === null){
            res.render('noPastOrders')
        }else{
            res.render('pastOrders',{orders:orders})
        }   
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getOnePastOrder = async (req,res) => {
    const orderID = req.params.orderID
    try {
        const pastOrder = await 
        Order.findById(orderID)
        .populate("_vanID").populate("items._itemID").lean() // find the past order
        let orderDate = pastOrder.orderTime
        var stringDate =  orderDate.toLocaleString()
        var rated = false
        if (pastOrder.rating){
            rated = true
        }
        res.render('onePastOrder',{"thisOrder":pastOrder,"rated":rated,"orderDate":stringDate}) //render page
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const rateOrder = async (req,res) => {
    const orderID = req.params.orderID
    const rating = req.body.rating // rating
    const comment = req.body.comment // optional comment
    try {
        const order = await Order.findById(orderID)
        if(order === null){
            return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
        }
        await Order.findByIdAndUpdate(orderID,{$set: {"rating": rating,"comment":comment}}) // update the order note
        res.redirect('/customer/pastOrderDetails/'+orderID)
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const getProfile = async (req,res) => {
    const customerID = req.session.passport.user._id
    try {
        const user = await User.findById(customerID).lean()
        res.render('profile',{"user":user})
    } catch (err) {   // error detected
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const changeUserInfo = async (req,res) => {
    const customerID = req.session.passport.user._id
    try{
        const newFirstname = req.body.firstname
        const newLastname = req.body.lastname
        await User.findByIdAndUpdate(customerID,{$set:{"firstname":newFirstname,"lastname":newLastname}})
        //onst newPassword = user.generateHash(req.body.password)
        //await User.findByIdAndUpdate(customerID,{$set:{"password":newPassword}})
        res.redirect('/customer/profile')
    }catch(err){
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }
}

const changeUserPassword = async (req,res) => {
    const customerID = req.session.passport.user._id
    try{  
        const user = await User.findById(customerID)
        const newPassword = user.generateHash(req.body.password)
        await User.findByIdAndUpdate(customerID,{$set:{"password":newPassword}})
        res.redirect('/customer/profile')
    }catch(err){
        return res.status(500).render('error', {errorCode: '500', message: 'Internal Server Error'})
    }

}

module.exports = {
    getCart,
    signup,
    login,
    showMap,
    addToCart,
    reduceQuan,
    increaseQuan,
    getCustomerOngoingOrder,
    confirmOrder,
    editNote,
    getCustomerPlacedOrder,
    changeOrder,
    cancelOrder,
    getCustomerPastOrders,
    getOnePastOrder,
    rateOrder,
    getProfile,
    changeUserInfo,
    changeUserPassword
};