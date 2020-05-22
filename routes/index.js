const express = require('express')
var router = express.Router();

const Question = require('../models/questions')
const Kahoot = require('../models/Kahoot')
const User = require('../models/user')
const {register,login} = require('../controller/userController')
const {saveKahootQuestion,getEachTitle,saveKahootTitle,deleteEachKahoot
    ,getallkahootbuythehost,editEachKahoot} = require('../controller/kahootController')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport')
process.env.SECRET_KEY = 'secure'

// const  {verifyUser} = require('../helper/Auth')

router.get('/',(req,res,next)=>{
    res.send('worked')
})

//register
router.post('/register',register);

//login route
router.post('/login', login);
//
    router.post('/question',(req,res,next)=>{
    let{
        qNumber,qTitle,option1,option2,option3,option4,cAnswer
    } = req.body

    Question.findOne({qNumber:qNumber})
    .then(question=>{
             if(question){
               return res.status(401).json({
                    success:false,
                    msg:`question ${qNumber} has already been added `
                })
             }else{
                let newQuestion =new  Question({
                    qNumber:qNumber,
                    qTitle:qTitle,
                    option1:option1,
                    option2:option2,
                    option3:option3,
                    option4:option4,
                    cAnswer:cAnswer,
                    pin:689698
                })
               newQuestion.save()
                res.json({
                    msg:`${req.body} was created`,
                    success:true,
                })
               
            }

           
            })
})

// delete question
router.delete('/question',(req,res,next)=>{
Question.deleteMany()
.then(question=>{
    res.json({
        Questions:question,
        success:true,
        msg:'All message are successfully deleted'
    })
})
})

// join kahoot
router.post('/joinKahoot',(req,res,next)=>{
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

})

// save kahoot title 
router.post('/saveKahootTitle', passport.authenticate('jwt',{
    session:false
    }),saveKahootTitle);
//getallkahootbuythehost
router.get('/saveKahootTitle', passport.authenticate('jwt',{
    session:false
    }),getallkahootbuythehost);


// deleteEachKahoot
router.post('/deleteEachKahoot/:id', passport.authenticate('jwt',{
    session:false
    }),deleteEachKahoot)  

//  editEachKahoot  
router.post('/editEachKahoot/:id', passport.authenticate('jwt',{
    session:false
    }),editEachKahoot)  
// getEachTitle
router.get('/getEachTitle/:id', passport.authenticate('jwt',{
    session:false
    }),getEachTitle)

// saveKahootQuestion
router.post('/saveKahootQuestion/:id', passport.authenticate('jwt',{
    session:false
    }),saveKahootQuestion)

module.exports = router;