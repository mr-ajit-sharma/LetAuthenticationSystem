const User = require('../../models/user');
// const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const passport = require('passport');
const bcrypt = require('bcryptjs');
// sign up function for routes
module.exports.signUp = (req, res) => {
    return res.render('sign_up', {
        title: 'Register'
    })
}
// sign in function for routes
module.exports.signIn = (req, res) => {
    return res.render('sign_in', {
        title: 'Login'
    })
}

// register function 
module.exports.register = async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    let errors = [];

    // check required fields
    if (!name || !email || !password || !confirm_password) {
        errors.push({ msg: `Please fill in all fields` });
    }

    // check passwords match
    if (password !== confirm_password) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Passwords should be at least 6 characters ' });
    }

    if (errors.length > 0) {
        res.render('sign_up', {
            title: 'Register',
            errors,
            name,
            email,
            password,
            confirm_password
        });
    } else {
        // Validation
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // Hash Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Store hash in your password DB.
                        newUser.password = hash;

                        //save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/sign-in')
                            })
                            .catch(err => console.log(`Error in hashing password ${err}`));
                    });
                });

            } else {
                // User exists
                errors.push({ msg: 'Email is already registered' });
                res.render('sign_up', {
                    title: 'Register',
                    errors,
                    name,
                    email,
                    password,
                    confirm_password
                });
            }
        } catch (err) {
            console.log('Error in creating error');
        }
    }
}

module.exports.signInSession = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/sign-in',
        failureFlash: true
    })(req, res, next);
}

module.exports.logOut = (req, res) => {
    req.logOut((err) => {
        if (err) {
            console.log(err,"log out error")
           res.send({message:"logout error"})
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/users/sign-in');
    });
}

module.exports.reset = (req, res) => {
    return res.render('reset', {
        title: 'Reset'
    })
}

module.exports.getEmail = async (req, res) => {
    try {
        let errors = [];
        const email = req.body.email;
        if (req.user.email === email) {
            const user = await User.findOne({ email: email }); // find user in the database
            if (user) {
                req.flash('success_msg', 'Change Your Password');
                console.log('Flash message set:', req.flash('success_msg'));
                return res.render('reset_password', {
                    title: 'Reset Password'
                });
            }

        } else {
            // res.redirect('back')
            errors.push({ msg: 'Enter your email again' });
            if (errors.length > 0) {
                res.render('reset', {
                    errors,
                    email,
                    title: 'reset'
                });
            }
            console.log('user is not same');
        }

    } catch (err) {
        
        errors.push({ msg: 'Wrong Email Enter your email again' });
    }
}

// Update users password
module.exports.updatePassword = async (req, res) => {
    const password= req.body.password;
    const confirmPassword= req.body.confirm_password;
    const userId = req.user._id;

    // check password is same or not
    if (password !== confirmPassword) {
        req.flash('error_msg', 'Passwords do not match');
        return res.redirect('back');
    }

    try {
        const user = await User.findById(userId); // Find the user by ID
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        req.flash('success_msg', 'Password updated successfully');
        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error updating password:', err);
        req.flash('error_msg', 'An error occurred while updating the password');
        res.redirect('back');
    }
}