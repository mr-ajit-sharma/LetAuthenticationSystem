module.exports.home = (req,res) => {
    return res.render('index', {
     title: 'home'
    })
 }
 
 module.exports.dashboard = (req,res) => {
    return res.render('dashboard', {
     title: 'Dashboard',
     user: req.user
    })
 }
 module.exports.createSession = (req, res) => {
    // req.flash('success_msg', 'Logged in Successfully');
    return res.redirect('/dashboard');
 };