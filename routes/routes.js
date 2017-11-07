// var express = require('express');
// var router = express.Router();
//
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//
// //module.exports = router;

module.exports = function(app, passport) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  // =====================================
  // LOGIN ===============================
  // =====================================
  app.get('/login', function(req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
  });

  // process the login form
   app.post('/login', passport.authenticate('local-login', {
     successRedirect : '/profile',
     failureRedirect : '/login',
     failureFlash : true //allow flash messages
   }));

  // =====================================
  // SIGNUP ==============================
  // =====================================
  app.get('/signup', function(req, res) {
    //DEBUGGING
    console.log(req);
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/signup',
    failureFlash : true //allows flash messages
  }));

  app.get('/profile', isLoggedIn, function(req, res) {
    //DEBUGGING
    console.log(req.user);
    res.render('profile.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // NEW FORM ============================
  // =====================================
  app.get('/make-report', isLoggedIn, function(req, res) {
    console.log("Let's make a new report.");
    res.render('form.ejs', {user: req.user});
  });

  // =====================================
  // VIEW FORM ===========================
  // =====================================
  app.get('/view-report', isLoggedIn, function(req, res) {
    //I don't have anything here yet so this is here temporarily
    res.redirect('/');
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

};

function isLoggedIn(req, res, next) {

  // if the user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}
