
/**
  * Module dependencies.
  */
var db = require('../accessDB');


module.exports = {

    // app.get('/'...)
    index: function(req, res) {
      console.log(db.mongoose);
      templateData = {}
      res.render('index.html', templateData);
    },

    // app.get('/register'...)
    getRegister: function(req, res) {
    res.render('register.html');
    },

    // app.post('/register'...)
    postRegister: function(req, res) {
    db.saveUser({
      fname : req.param('firstname')
    , lname : req.param('lastname')
    , email : req.param('email')
    , password : req.param('password')
    }, function(err,docs) {
      res.redirect('/account');
    });
    },

    // app.get('/about', ...
    about: function(req, res) {
    res.render('about.jade');
    },

    // app.get('/login', ...
    login: function(req, res) {
        
        templateData = {
             message: req.flash('error')[0] // if error message is received from prior login attempt
        }
        
        console.log(templateData);
        console.log("*********");
        res.render('login.html', templateData);
    },

    // app.get('/account', ensureAuthenticated, ...
    getAccount: function(req, res) {
        templateData = {
            currentUser : req.user
        }
    
      res.render('account.html', templateData );
    },

    // app.get('/logout'...)
    logout: function(req, res){
    req.logout();
    res.redirect('/');
    }

};


