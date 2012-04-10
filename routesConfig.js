/** routes.js
  */
var passport = require('passport');

// Route methods
var userRoute = require('./routes/user');

// If user is authenticated, redirect to 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = function(app) {
    
    app.get('/', userRoute.index);
    
    // Register User - display page
    app.get('/register', userRoute.getRegister);
    
    //Register User - receive registration post form
    app.post('/register', userRoute.postRegister);
    
    
    // Display login page
    app.get('/login', userRoute.login);
    
    // Login attempted POST on '/local'
    // Passport.authenticate with local email and password, if fails redirect back to GET /login
    // If successful, redirect to /account
    app.post('/login', 
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        function(req, res) {
            res.redirect('/account');
        });
    
    // Display account page
    app.get('/account', ensureAuthenticated, userRoute.getAccount);

    app.post('/account/changepassword', ensureAuthenticated, userRoute.postChangePassword),
    
    // Logout user
    app.get('/logout', userRoute.logout);

    app.get('/getusers', userRoute.getUsers);
    
    app.post('/upload', ensureAuthenticated, userRoute.uploadPost);    
    app.get('/deleteimage/:imageID', ensureAuthenticated, userRoute.deleteImage);
}
