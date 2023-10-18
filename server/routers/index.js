const router = require('express').Router();
const passport = require('passport')
const { ensureAuthenticated, forwardAuthenticated } = require('../../configs/auth');

const mainController = require('../../server/controllers/mainController');

router.get('/' , mainController.home);

// dashbaord
router.get('/dashboard', ensureAuthenticated , mainController.dashboard);

// google auth
router.get('/users/auth/google',(req,res,next)=>{
console.log("google api is working")
next();
}, passport.authenticate('google',{scope: ['profile', 'email']}));
router.get('/users/auth/google/callback',(req,res,next)=>{
console.log("before authenticate")
next()
}, passport.authenticate('google',{failureRedirect: '/'}),(req,res,next)=>{
console.log("after authenticate")
next();
}, mainController.createSession);

router.use('/users', require('./user'));


module.exports = router;