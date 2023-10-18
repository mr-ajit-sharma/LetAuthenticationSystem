const { log } = require('console');
const router = require('express').Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../../configs/auth');
const usersController = require('../controllers/userController');

// sign up page
router.get('/sign-up' , usersController.signUp);

//sign in page
router.get('/sign-in', usersController.signIn);

//sign-out
// router.get('/sign-out', usersController.signOut);

// Register Handle
router.post('/sign-up', usersController.register);

// sign in Handle
router.post('/sign-in', usersController.signInSession);

// log -out 
router.get('/sign-out', usersController.logOut);


// reset 
router.get('/reset', ensureAuthenticated, usersController.reset);

//get email 
router.post('/reset', ensureAuthenticated, usersController.getEmail);
// reset password
// router.get('/reset-password', ensureAuthenticated, usersController.resetPassword);
router.post('/reset-password', usersController.updatePassword);
module.exports = router;