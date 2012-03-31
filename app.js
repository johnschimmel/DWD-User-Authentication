
/**
 * Module dependencies.
 */

// base dependencies for app
var express = require('express')
  , routes = require('./routes')
  , DB = require('./accessDB').AccessDB
  , passport = require('passport')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongodb')
  , hbs = require('hbs');

var app = module.exports = express.createServer();
global.app = app;

var DB = require('./accessDB');

// this should be moved to .env file
var conn = 'mongodb://heroku_app3528267:iccjel18kpf6bi8c4mgfql7e56@ds031657.mongolab.com:31657/heroku_app3528267';
var db;

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
  app.register('html',require('hbs')); //use .html files in /views instead .hbs
  
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  //app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.static(__dirname + '/public'));

  app.use(express.session({ 
    store: mongoStore(conn)
  , secret: 'applecake'
  }, function() {
    app.use(app.router);
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/public'));
});

db = new DB.startup(conn);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
require('./routes')(app);


// Handlebars Test Helpers and Partials

hbs.registerHelper('link_to', function(context) {
  return "<a href='" + context.url + "'>" + context.body + "</a>";
});

hbs.registerHelper('link_to2', function(title, context) {
  return "<a href='/posts" + context.url + "'>" + title + "</a>"
});

hbs.registerHelper('list', function(items, fn) {
  var out = "<ul>";
  for(var i=0, l=items.length; i<l; i++) {
    out = out + "<li>" + fn(items[i]) + "</li>";
  }
  return out + "</ul>";
});

hbs.registerPartial('link2', '<a href="/people/{{id}}">{{name}}</a>');


// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);

});
