const { error } = require('console')
const mongoose=require('mongoose')
mongoose.connect(process.env.MONGO)
const db=mongoose.connection
db.on('error',()=>{
    console.error(error,"error in connnecting with the database")
})
db.once('open',()=>{
    console.log("database is connected server successfully")
})
module.exports=db