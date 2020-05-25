var createError = require('http-errors');
var express = require('express');
var indexRouter = require('./routes/index');
var path = require('path');
const cors = require('cors')
const passport = require('passport')

// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
var logger = require('morgan');
// const passport = require('passport')
const mongoose = require('mongoose');
let app= express()
//map global promise - get rid of warning
mongoose.promise=global.promise;
// mongoose.connect( 'mongodb://localhost/kahoot',
  
mongoose.connect( 'mongodb+srv://user:user@cluster0-p7r06.mongodb.net/test?retryWrites=true&w=majority',
{useNewUrlParser:true,
  useUnifiedTopology: true 
})
.then(()=> console.log(' DB connected'))
.catch((err) => console.log(err));


let port = 2000





app.use(logger('dev'));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())
require("./config/passport")(passport)
app.use('/',indexRouter)

app.get('*',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'public/index.html'))
  })
app.listen(port,()=>{
    console.log(`server listening on port  ${port}`)
  });