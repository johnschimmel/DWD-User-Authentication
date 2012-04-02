/** routes.js
  */

var passport = require('passport');
var userRoute = require('./routes/user');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports = function(app) {

  app.get('/', userRoute.index);

  app.get('/register', userRoute.getRegister);
  app.post('/register', userRoute.postRegister);

  app.get('/about', userRoute.about);

  app.get('/login', userRoute.login);
  app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    function(req, res) {
      res.redirect('/account');
    });

  app.get('/account', ensureAuthenticated, userRoute.getAccount);

  app.get('/logout', userRoute.logout);


}
