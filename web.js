
/**
 * Module dependencies.
 */

// base dependencies for app
var express = require('express')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , ejs = require('ejs')
  , routes = require('./routesConfig')
  , DB = require('./accessDB').AccessDB
  , mongoStore = require('connect-mongodb');

var app = module.exports = express.createServer();
global.app = app;

var DB = require('./accessDB');

// this should be moved to .env file
var conn = 'mongodb://heroku_app3528267:iccjel18kpf6bi8c4mgfql7e56@ds031657.mongolab.com:31657/heroku_app3528267';
var db;

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
  app.register('html',require('ejs')); //use .html files in /views instead .hbs
  
  //Cookies must be turned on for Sessions
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  /*** Turn on Express Sessions - Use MongoStore ***/
  app.use(express.session({ 
    store: mongoStore({url:process.env.MONGOLAB_URI})
  , secret: 'SuperSecretString'
  }, function() {
    app.use(app.router);
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(express.static(__dirname + '/static'));
  
  /**** Turn on some debugging tools ****/
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
});

db = new DB.startup(process.env.MONGOLAB_URI);


// Routes
require('./routesConfig')(app);

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);

});
