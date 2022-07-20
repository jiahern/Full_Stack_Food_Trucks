const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: {type: String, required: true},
    singlePrice : {type: Number, min : 0, required: true},
    description : String,
    image : String,
    type: {
        type: String,
        Enum : ["Drink","Snack"],
    },  
    size : {
        type: String,
        Enum : ["Large","Regular","Small"],
        default : "Regular"
    },  
    sugar : {
        type: String,
        Enum : ["Normal","Half","Sugar Free"],
        default : "Normal"
    },
    ice:{
        type: String,
        Enum : ["Normal","Less","Ice free"],
    }
})

const Food = mongoose.model('Food', foodSchema)
module.exports= Food    
