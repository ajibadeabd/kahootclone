const mongoose =require('mongoose')
const Question =require('../models/questions')
const Kahoot =require('../models/Kahoot')
const User =require('../models/user')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const passport = require('passport')
process.env.SECRET_KEY = 'secure'

exports.register =  function(req, res, next) {

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
  };


exports.login = function(req, res, next) {
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
    
    
  
}
