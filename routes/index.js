const express = require('express')
const router = express.Router()
const Question = require('../models/questions')
const Kahoot = require('../models/Kahoot')

router.get('/',(req,res,next)=>{
    res.send('worked')
})

// post question 
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

// get all kahoot question 
router.post('/saveKahootTitle',(req,res,next)=>{
let {Title}=req.body

let newKahoot = new Kahoot({ KahootTitle:Title})
    newKahoot.save()
    return res.status(201).json({
        success:true,
        msg:`${Title} has been created`
    })

});

router.post('/saveKahootQuestion',(req,res,next)=>{
    console.log(req.body)
    let {
        Answer1,
        Answer2,
        Answer3,
        Answer4,
        question,
        correctAnswer,
        Title
    } = req.body
            Kahoot.findOne({Title:Title})
            .then(found=>{
                if(!found) {
                    return res.status(404).json({
                        success:false,
                        msg:'specify the title for the kahoot quiz'
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
                    })
                   newQuestion.save()
                    res.json({
                        msg:`${req.body} was created`,
                        success:true,
                    })
                }
            })

    // let newKahoot = new Kahoot({ KahootTitle:Title})
    //     newKahoot.save()
    //     return res.status(201).json({
    //         success:true,
    //         msg:`${Title} has been created`
    //     })
    
    });



module.exports = router;