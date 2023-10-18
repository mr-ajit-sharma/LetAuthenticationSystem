const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const GoogleStrategy = require('passport-google-oauth2')    
const dotenv = require('dotenv')
dotenv.config()

// load user model
const User = require('../models/user')

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
            // match the user
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "that email is not registered" })
                    }
                    bcrypt.compare(password,user.password,(err,isMatch)=>{
                        if(err) throw err;
                        if(isMatch){
                            return done(null,user)
                        }else{
                            return done(null ,false,{message:"incorrect password"})
                        }
                    })
                })
        }
    ))
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser((user,done)=>{
        User.findById(id)
        .then(user=>{return done(null,user);})
        .catch(err=>{return done(err,null)})
    })
    
}
//google strategy 
// tell the google to use the new strategy for google login 
passport.use(new GoogleStrategy({
    // getting the required data
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_SECRET,
    callbackURL:process.env.CALL_BACK,
    scope:["profile","email"]
    },

async function(accessToken,refreshToken,profile,done){
try {
    console.log(profile,"->profile")
    // find the user  email out of many users email
    const user=await User.findOne({email:profile.emails[0].value})
    // if user found
    if(user){
        console.log(user ,"->user")
        return done(null,user)
    }else{
        // if not found then creating
        const newUser=await User.create({
            name:profile.displayName,
            email:profile.emails[0].value,
            // creating the random password in hex form 
            password:crypto.randomBytes(20).toString('hex')
        })
        console.log(newUser,"->new user")
        return done(null,newUser)
    }
} catch (error) {
    console.log(error,"error in google auth")
    return done(null,false,{message:"the email is not registered:google"})
}
}
)
)
// serializer function
passport.serializeUser((user, done) => {
    done(null, user);
});
// deserializeUser function
passport.deserializeUser(function(user, cb) {
    cb(null, user);
 });