const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String
        },
   
  date:{
      type:Date,
      default:Date.now
  }
});

module.exports = mongoose.model('user', userSchema);