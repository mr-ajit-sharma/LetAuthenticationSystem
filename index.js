const express=require('express')
require('dotenv').config()
const port=process.env.Port || 8000
const db=require('./configs/mongoose')
const expressLayouts=require('express-ejs-layouts')
const flash=require('connect-flash')
const MongoStore=require('connect-mongo')
const session=require('express-session')
const passport=require('passport')
const app=express()

// config pasport
require('./configs/passport')(passport)

// setup template engine
app.use(expressLayouts)

// extract style and script
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)

// view engine
app.set('view engine','ejs')
app.set('views','./views')

// using static files
app.use(express.static('./assets'))

// bodyparser
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// express session
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO,
        autoRemove:'disabled'
    })
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash())

// global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})

// routing configuration    
app.use('/',require('./server/routers/index'))


// server starting
app.listen(port,(err)=>{
    if(err){
        console.log("internal server error in connecting to the port")
    }
    console.log(`the server is connected to the port ${port}`)
})