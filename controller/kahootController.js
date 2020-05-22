const mongoose =require('mongoose')
const Question =require('../models/questions')
const Kahoot =require('../models/Kahoot')
const User =require('../models/user')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const passport = require('passport')

exports.saveKahootQuestion = (req,res,next)=>{
    let {
        Answer1,
        Answer2,
        Answer3,
        Answer4,
        question,
        correctAnswer,
        Title,
    } = req.body
    console.log(question)
            
                Question.findOne({qQuestion:question})
                .then(found=>{
                    if (found) {
                        return res.status(404).json({
                                        success:false,
                                        msg:'this question has been created before'
                                    })
                    }else{
                        let newQuestion =new  Question({
                            qTitle:Title,
                            qQuestion:question,
                            option1:Answer1,
                            option2:Answer2,
                            option3:Answer3,
                            option4:Answer4,
                            cAnswer:correctAnswer,
                            user:req.user._id,
                        })
                       newQuestion.save()
                       console.log(newQuestion)
                        return res.status(201).json({
                            msg:`question was created`,
                            success:true,
                        })
                    }
                })
                   
           
    };

// getEachTitle
exports.getEachTitle= (req,res,next)=>{
    console.log(req.params.id)
    Kahoot.findById(req.params.id)
    .then(Title=>{
        console.log(Title)
        return res.status(200).json({
            success:true,
            Title:Title
        })
    })
}


// getEachTitle
exports.saveKahootTitle=(req,res,next)=>{
    let {Title}=req.body
    console.log('con')
    
    let newKahoot = new Kahoot({
        KahootTitle:Title,
        user:req.user._id
        })
        newKahoot.save()
        return res.status(201).json({
            success:true,
            msg:`${Title} has been created`
        })
    
    }
    // getallkahootbuythehost
    exports.getallkahootbuythehost =(req,res,next)=>{
        Kahoot.find({ user:req.user._id})
        .then(kahoot=>{
            // console.log(kahoot)
            return res.status(200).json({
                success:true,
                msg:'these are all your kahoot',
                kahoots:kahoot
            })
        })
        }
//deleteEachKahoot
  exports.deleteEachKahoot=(req,res,next)=>{
            console.log(req.params.id)
            console.log(req.body.Title)
    
    Kahoot.findByIdAndDelete({_id:req.params.id})
    .then(kahoot=>{
        console.log(kahoot)
        Question.deleteMany({qTitle:req.body.Title})
        .then(gone=>{
            console.log(gone)
    })
    })
        }


     exports.editEachKahoot=  (req,res,next)=>{
            console.log(req.params.id)
            console.log(req.body)
            
            Kahoot.findById(req.params.id)
            .then(kahoot=>{
                console.log(kahoot)
                kahoot.KahootTitle=req.body.Title
                kahoot.save()
                    res.status(201).json({
                        success:true,
                        msg:`${req.body.Title} is successfully updated`
                })
            })
                }
//join kahoot
 exports.joinKahoot = (req,res,next)=>{
                    let {name,pin} =req.body
                     if(!name){
                         return res.status(400).json({
                             success:false,
                             message:'please provide a name'
                         })
                     } 
                     if(!pin){
                         return res.status(400).json({
                             success:false,
                             message:'please provide a code to join'
                         })
                     }else{
                         Question.findOne({pin:pin})
                         .then(pin=>{
                             if(!pin){
                                 return res.status(400).json({
                                     success:false,
                                     message:'invalid pin'
                                 })
                             }else{
                                 //  code to join kahoot
                                 console.log('proceed to ..')
                             }
                         })
                     }
                 
                 }
exports.displayAllKahoot= (req,res,next)=>{
    Kahoot.find()
    .then(kahoot=>{
        console.log(kahoot)
        return res.status(201).json({
            success:true,
            msg:'these are the kahoot questions',
            kahoot:kahoot
        })
    }).catch(err=>{
        res.status(400).json({
            success:'',
            msg:'i still dea think am'
        })
    })
}

exports.allQuestionId = (req,res,next)=>{
    Question.find({qTitle:req.params.id,
                    user:req.user._id})
    .then(question=>{
        console.log(question)
        return res.status(201).json({
            success:true,
            msg:'these are the kahoot questions',
            question:question
        })
    }).catch(err=>{
        res.status(400).json({
            success:'',
            msg:'i still dea think am'
        })
    })
} 