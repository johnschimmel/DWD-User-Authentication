
/**
  * Module dependencies.
  */
var db = require('../accessDB');


module.exports = {

    // app.get('/'...)
    index: function(request, response) {
      
        templateData = {}
        response.render('index.html', templateData);
    },

    // app.get('/register'...)
    getRegister: function(request, response) {
        response.render('register.html');
    },

    // app.post('/register'...)
    postRegister: function(request, response) {
        db.saveUser({
              fname : request.param('firstname')
            , lname : request.param('lastname')
            , email : request.param('email')
            , password : request.param('password')
        }, function(err,docs) {
            response.redirect('/account');
        });
    },

    // app.get('/login', ...
    login: function(request, response) {
        
        templateData = {
             message: request.flash('error')[0] // get error message is received from prior login attempt
        }
        
        response.render('login.html', templateData);
    },

    // app.get('/account', ensureAuthenticated, ...
    getAccount: function(request, response) {
        templateData = {
            currentUser : request.user
        }
    
        response.render('account.html', templateData );
    },

    getUsers : function(request, response) {
        db.User.find({},['email','name.first','name.last'], function(err,users) {
            
            if (err) {
                console.log(err);
                response.send("an error occurred");
            }
            
            response.json(users);
            
        })
        
    },
    
    // app.get('/logout'...)
    logout: function(request, response){
        request.logout();
        response.redirect('/');
    }

};


