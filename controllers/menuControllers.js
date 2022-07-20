const mongoose = require("mongoose");
const Food = mongoose.model("Food");
const Order = mongoose.model("Order")

const getMenu = async (req,res) => {
    if (typeof req.params.vanID !== 'undefined' && req.params.vanID !== null){
        req.session.vanID = req.params.vanID
    }
    if (req.isAuthenticated()){
        const customerID = req.session.passport.user
        const ongoingOrder = await Order.findOne( {$and :[{"status": "ongoing"},{"_customerID": customerID}]}).lean()
        if (ongoingOrder !== null) {
            req.session.vanID = ongoingOrder._vanID
        }
        const processingOrder = await 
        Order.findOne( {$and :[{$or : [ {"status": "fulfilled"},{"status" : "fulfilling"}] },{"_customerID": customerID}]}).lean()
        if (processingOrder !== null) {
            req.session.vanID = processingOrder._vanID
            res.redirect('/customer/customerPlacedOrder')
        }

    }
    if (typeof req.session.vanID !== 'undefined' && req.session.vanID !== null){
        try {
            const menu_items = await Food.find({$and:[{size:"Regular"},{sugar:"Normal"},{ice:"Ice free"}]}).lean();
            res.render('menu',{"menuitem": menu_items,"vanID": req.session.vanID})  
        }catch(err) {
            res.status(400)
            return res.send("Database query failed")
        }
    }else{
        res.redirect('/customer/')
    }
};



const getDescription = async (req,res) => {
    try {
        const f_ = await Food.findOne({name: req.params.name});
        return res.send(f_['description']);
    }catch(err) {
        res.status(400)
        return res.send("Database query failed")
    }
};


module.exports = {
    getMenu, getDescription
};