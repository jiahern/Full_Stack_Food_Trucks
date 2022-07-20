const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderID : {type: String},
    _customerID :{
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'User',
        required: true},
    status: {
        type: String,
        Enum : ["ongoing","fulfilling","fulfilled","complete","cancelled"],
        default : "ongoing"
    },   
    items : [
        {_itemID: {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'Food'
            },
        quantity:{type: Number , default: 1, min : 0}
        }
    ], 
    _vanID :{
        type: mongoose.Schema.Types.ObjectId, 
        ref : 'Van',
        required: true
    },
    note : {type: String},
    subTotal: {type: Number , min : 0},
    totalPrice : {type: Number , min : 0},
    orderTime : {type:Date, default: Date.now},
    rating: {type:Number, min:1, max:5},
    comment: {type: String}
})

const Order = mongoose.model('Order', orderSchema)
module.exports= Order