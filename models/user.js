const mongoose = require("mongoose");
const bcrypt   = require('bcrypt-nodejs')

const UserSchema = new mongoose.Schema({
  role:{
    type: String, 
    default: 'customer',
    required: true
  },
    
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  }
});

UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10),null)
}

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model("User", UserSchema)
module.exports= User