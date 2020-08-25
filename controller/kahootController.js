const mongoose =require('mongoose')
const Question =require('../models/questions')
const Kahoot =require('../models/Kahoot')
const User =require('../models/user')
const Joined =require('../models/joined')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const passport = require('passport')

exports.saveKahootQuestion = (req,res,next)=>{
    let {Answer1,Answer2,Answer3,Answer4,question,correctAnswer,Title} = req.body
                Question.findOne({qQuestion:question,user:req.user._id})
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
    Kahoot.findById(req.params.id)
    .then(Title=>{
        return res.status(200).json({
            success:true,
            Title:Title
        })
    })
}


// getEachTitle
exports.saveKahootTitle=(req,res,next)=>{
    let {Title}=req.body
    let  makeid= (length)=> {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }
     let code = makeid(7)
    let newKahoot = new Kahoot({
        KahootTitle:Title,
        code:code,
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
            res.status(201).json({
                success:true,
                msg:`${req.body.Title} was deleted`
        })
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
                    let {code,name} =req.body
                    // let name =req.user.userName
                    console.log(req.user._id)
                     if(!name){ return res.status(400).json({
                             success:false,
                             message:'please provide a name' })} 
                     if(!code){ return res.status(400).json({
                             success:false,
                             message:'please provide a code to join' })
                     }else{
                         Kahoot.findOne({code:code})
                         .then(code=>{if(!code){ return res.status(400).json({
                                     success:false,
                                     msg:'invalid code'})}
                             else{Joined.findOne({
                                    name:name,
                                    code:req.body.code,
                                    Title:code.KahootTitle,
                                    user:code.user
                                })
                                .then(name=>{
                                    if (name) {
                                        return res.status(400).json({
                                            success:false,
                                            msg:'user already joined the game'
                                        }) 
                                    }else{
                                        let joinUser = new Joined({
                                            name:req.body.name,
                                            code:req.body.code,
                                            user:code.user,
                                            Title:code.KahootTitle,
                                        })
                                        joinUser.save()
                                        .then(user=>{
                                            console.log(user)
                                            return res.status(201).json({
                                                success:true,
                                                msg:`${user.name} joined` ,
                                                user:user
                                            })
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                                    }
                                })
                                 
                             }
                         })
                     }
                 
                 }

exports.displayplayersForEachKahoot= (req,res,next)=>{
    console.log(req.params.title)
    Joined.find({
        code:req.params.id,
        Title:req.params.title,
        user:req.user._id
    })
    .then(kahoot=>{
        console.log(kahoot)
        return res.status(200).json({
            success:true,
            user:kahoot
        })
    })
}


exports.displayAllKahoot= (req,res,next)=>{
    Kahoot.find()
    .then(kahoot=>{
        console.log(kahoot)
        return res.status(200).json({
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
            msg:'these are the questions',
            question:question
        })
    }).catch(err=>{
        res.status(400).json({
            success:'',
            msg:'i still dea think am'
        })
    })
} 

// exports.displayEachKahootQuestionHost 


exports.userQuestion = (req,res,next)=> {
    console.log(req.params.code)
    Question.find({code:req.params.code})
    .then(question=>{
        console.log(question)
        return res.status(201).json({
            success:true,
            msg:'these are the questions',
            question:question
        })
    }).catch(err=>{
        res.status(400).json({
            success:'',
            msg:'y u change the route you think say you wise abi'
        })
    })

}
exports.displayJoinedUserPage=(req,res,next)=>{
    console.log(req.params.id)
    Joined.findById(req.params.id)
    .then(user=>{
        return res.status(200).json({
            success:true,
            msg:`${user.name} has truely joined`,
            user:user
        })
    }).catch(err=>{
    })
}
// displayJoinedUserPage