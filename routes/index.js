const express = require('express')
var router = express.Router();

const Question = require('../models/questions')
const Kahoot = require('../models/Kahoot')
const User = require('../models/user')
const {register,login} = require('../controller/userController')
const {saveKahootQuestion,getEachTitle,saveKahootTitle,deleteEachKahoot,joinKahoot,displayAllKahoot,
    displayJoinedUserPage
    ,getallkahootbuythehost,editEachKahoot,allQuestionId,displayplayersForEachKahoot,userQuestion} 
    = require('../controller/kahootController')

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

// join kahoot
router.post('/joinKahoot', passport.authenticate('jwt',{
    session:false
    }),joinKahoot)

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
// displayAllKahoot
router.get('/displayAllKahoot', passport.authenticate('jwt',{
    session:false
    }),displayAllKahoot)
// allQuestionId
router.get('/allQuestionId/:id', passport.authenticate('jwt',{
        session:false
        }),allQuestionId)
        // displayplayersForEachKahoot
router.get('/displayplayersForEachKahoot/:id/:title', passport.authenticate('jwt',{
        session:false
        }),displayplayersForEachKahoot)
        // userQuestion

router.get('/userQuestion/:code', passport.authenticate('jwt',{
        session:false
        }),userQuestion)
 router.get('/displayJoinedUserPage/:id',
 passport.authenticate('jwt',{
    session:false
    }),displayJoinedUserPage)                   
module.exports = router;
