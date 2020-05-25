const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const joinedSchema = new Schema({
    name:{
        type:String,
        required:true

    },
    user:{
        type:String,
        required:true

    },
    code:{
        type:String,
        required:true

    },
    Title:{
        type:String,
        required:true

    },
  date:{
      type:Date,
      default:Date.now
  }
});

module.exports = mongoose.model('joined', joinedSchema);
