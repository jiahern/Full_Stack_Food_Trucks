const mongoose = require("mongoose");
const bcrypt   = require('bcrypt-nodejs');

// Schema for van data
const vanSchema = new mongoose.Schema({
    
    role: {type: String, default: 'van', required: true},
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    photo: String,
    description: String,
    textLocation: {type: String, required: true},
    geolocation: {
        Latitude: {type: Number, required: true, default: -37.84},
        Longitude: {type: Number, required: true, default: 144.94}
    },    
    status: {type: String, enum: ['ready-for-orders', 'closed'], required: true, default: 'closed'},
    order: String
})

vanSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null)
  }

vanSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
  }


const Van = mongoose.model("Van", vanSchema)

module.exports = Van