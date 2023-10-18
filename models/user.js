const mongoose=require('mongoose')
const { boolean } = require('webidl-conversions')
const userSchema=new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
},
date:{
    type:Date,
    required:false
}

},{
    timestamps:true
})
const User=mongoose.model('User',userSchema)
module.exports=User