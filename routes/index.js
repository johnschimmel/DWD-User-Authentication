
/**
  * Module dependencies.
  */
var db = require('../accessDB');


module.exports = {

  // app.get('/'...)
  index: function(req, res) {
      templateData = {
          title: 'Express Handlebars Test',
          // basic test
          name: 'Alan',
          hometown: "Somewhere, TX",
          kids: [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}],
          // path test
          person: { "name": "Alan" }, company: {"name": "Rad, Inc." },
          // escapee test
          escapee: '<jail>escaped</jail>',
          // helper test
          posts: [{url: "/hello-world", body: "Hello World!"}],
          // helper with string
          posts2: [{url: "/hello-world", body: "Hello World!"}],
          // for block helper test
          people: [
            {firstName: "Yehuda", lastName: "Katz"},
            {firstName: "Carl", lastName: "Lerche"},
            {firstName: "Alan", lastName: "Johnson"}
          ],
          people2: [
            { name: { firstName: "Yehuda", lastName: "Katz" } },
            { name: { firstName: "Carl", lastName: "Lerche" } },
            { name: { firstName: "Alan", lastName: "Johnson" } }
          ],
          // for partial test
          people3: [
            { "name": "Alan", "id": 1 },
            { "name": "Yehuda", "id": 2 }
          ]
        }
      
    res.render('index.html', templateData);
  },

  // app.get('/register'...)
  getRegister: function(req, res) {
    res.render('register.jade');
  },

  // app.post('/register'...)
  postRegister: function(req, res) {
    db.saveUser({
      fname : req.param('name.first')
    , lname : req.param('name.last')
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
    res.render('login.jade');
  },

  // app.get('/account', ensureAuthenticated, ...
  getAccount: function(req, res) {
    db.getMyEvent(function(err, myEvent) {
      res.render('account.jade', { locals:
        { title: 'CrowdNotes' 
        , currentUser: req.user
        , myEvent: myEvent }
      });
    });
  },

  // app.get('/logout'...)
  logout: function(req, res){
    req.logout();
    res.redirect('/');
  }

};


