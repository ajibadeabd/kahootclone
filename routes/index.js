const express = require('express')
var router = express.Router();

const Question = require('../models/questions')
const Kahoot = require('../models/Kahoot')
const User = require('../models/user')

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

router.post('/register', function(req, res, next) {
    console.log('eget')

    let {
      userName,
      password,
      confirm_password,
      email
    } = req.body
    if (password !== confirm_password) {
      return res.status(400).json({
        msg:'Password incorrect'
      })
      ;
    }
    else{
      User.findOne({
        userName:userName
      }).then((user)=>{
        if(user) {
        return res.status(400).json({
            msg:"Username already taken" 
        })
        }else{
          User.findOne({
            email:email
        })
        .then((user)=>{
          if(user) {
           return res.status(400).json({
              msg:"email  already been registerd. did you forget your password" 
          })
          
          }
          else{
            let newUser= new User({
              userName,
              email,
              password,
              
              })
              // console.log(newUser)
              //  hash password
               bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err
                    newUser.password=hash;
                    
                    newUser.save()
                    .then((user)=>{
                        
                      
                        res.status(201).json({
                            success:true,
                            msg:`i am please to inform you that  ${user.userName} successfully registerd`
                        })
                    }
                    )
                    .catch(err=>{
                        res.json({
                          error:err
                          
                        })
                    })
                })
                })
          }
        })
        }
      })
    }
  });


  router.post('/login', function(req, res, next) {
    User.findOne({email:req.body.email})
    .then(user=>{
      if (!user) {
        return res.status(404).json({
          msg:'no email found',
          success:false
        })
      }else{}
      bcrypt.compare(req.body.password,user.password)
    .then(ismatch=>{
        if(ismatch){ 
            const payload={
             userName:user.userName,
             _id:user._id,
              password:user.password,
              email:user.email,
    
            }
            jwt.sign(payload,process.env.SECRET_KEY, {
                expiresIn:"1000h"
    
              },(err,token)=>{
                  res.status(200).json({
                        success:true,
                     token:`Bearer ${token}`   , 
                     user:user,
                      msg:"you are now logged in"
                  });
                })
        }else{
           return res.status(404).json({
                success:false,
                  
                 msg:"incorrect password"
            })
        }
    })
    })
    
    
  
  });
  

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
    }),(req,res,next)=>{
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

});
//get all kahoot buy the host
router.get('/saveKahootTitle', passport.authenticate('jwt',{
    session:false
    }),(req,res,next)=>{
Kahoot.find({ user:req.user._id})
.then(kahoot=>{
    // console.log(kahoot)
    return res.status(200).json({
        success:true,
        msg:'these are all your kahoot',
        kahoots:kahoot
    })
})
});


// deleteEachKahoot
router.post('/deleteEachKahoot/:id', passport.authenticate('jwt',{
    session:false
    }),(req,res,next)=>{
        console.log(req.params.id)
        console.log(req.body.Title)

Kahoot.findByIdAndDelete({_id:req.params.id})
.then(kahoot=>{
    console.log(kahoot)
    Question.remove({KahootTitle:req.body.Title})
    .then(gone=>{
        console.log(gone)
})
})
    })

//  editEachKahoot  
router.post('/editEachKahoot/:id', passport.authenticate('jwt',{
    session:false
    }),(req,res,next)=>{
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
    })
// getEachTitle
router.get('/getEachTitle/:id', passport.authenticate('jwt',{
    session:false
    }),(req,res,next)=>{
            console.log(req.params.id)
            Kahoot.findById(req.params.id)
            .then(Title=>{
                console.log(Title)
                return res.status(200).json({
                    success:true,
                    Title:Title
                })
            })
    })

// saveKahootQuestion
router.post('/saveKahootQuestion/:id', passport.authenticate('jwt',{
    session:false
    }),(req,res,next)=>{
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
            // Kahoot.findById(req.params.id)
            // .then(found=>{
            //     if(!found) {
            //         return res.status(404).json({
            //             success:false,
            //             msg:'specify the title for the kahoot quiz'
            //         })
            //     }else{
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
                    return res.json({
                        msg:`question was created`,
                        success:true,
                    })
            //     }
            // })
    });



module.exports = router;