const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kahootSchema = new Schema({
    KahootTitle:{
        type:String,
        required:true

    },
  date:{
      type:Date,
      default:Date.now
  }
});

module.exports = mongoose.model('kahoot', kahootSchema);