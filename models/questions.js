const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    qTitle:{
        type:String,
        required:true

    },
    qQuestion:{
        type:String,
        required:true

    },
    option1:{
        type:String,
        required:true

    },
    option2:{
        type:String,
        required:true
    },
    option3:{
        type:String,
        required:true

        },
    option4:{
        type:String,
        required:true
    
            },
            cAnswer:{
                type:String,
                 required:true
                  },        
                        
                         
  date:{
      type:Date,
      default:Date.now
  }
});

module.exports = mongoose.model('question', questionSchema);