// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
//var User = require('../models/user');

//For MySQL version, loads up the query module
var query = require('../models/query');
var loginquery = require('../models/loginquery');


module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // REQUIRED for persistent login sessions

  // Passport needs ability to serialize and unserialize users out of session
  passport.serializeUser(function(user, done) {
    console.log("SERIALIZE USER INVOKED.");
    console.log("user then user.id...");
    console.log(user);
    console.log(user.ID);
    done(null, user.ID);
  });

  passport.deserializeUser(function(id, done) {
    /*
    User.findById(id, function(err, user) {
      done(err, user);
    });
    */
    query.newQuery("SELECT * FROM users u WHERE u.id = '" + id + "';", function(err, data) {
      console.log("DESERIALIZE USER INVOKED.");
      var user = data[0]
      console.log(user);
      done(err, user);
    });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-signup', new LocalStrategy({
    //by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {

    //asynchronuous :P
    //User.findOne won't fire unless data is sent back
    process.nextTick(function() {
      //find a user whose email is the same as the forms email
      //we are checking to see if the user is trying to login already exists
      /* OLD MONGOOSE FUNCTION
      User.findOne({ 'local.email' : email}, function(err, user) {
        if (err) return done(err);
        //Checks if the user already exists
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use'));
        }
        else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.local.email = email;
          newUser.local.password  = newUser.generateHash(password);

          // save the user
          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
      */
      query.newQuery("SELECT email FROM users u WHERE u.email LIKE '" + email + "';", function(error, data) {
        if (error) return done(error);

        //Checks if the user already exists
        console.log("Data: ");
        console.log(data);
        var statement = (data.length > 0);
        console.log(statement);
        if (statement) {
          return done(null, false, req.flash('signupMessage', 'That email is already in use'));
        }
        else {
          var hashedPassword = loginquery.generateHash(password);
          query.newQuery("INSERT INTO users (email, password) VALUES ('" + email + "', '" + hashedPassword + "', false);", function(err, data) {
            console.log("Insert function completed.");
            console.log("data variable contains: ");
            console.log(data);
            if (err) throw err;
            return done(null, data[0]);
          });
        }
      });

    });
  }));

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {// callback with email and password from our form

      // find a user whose email is the same as the form's email
      // we are checking to see if the user trying to login exists
      /* OLD MONGOOSE FUNCTION
      User.findOne({'local.email' : email}, function(err, user) {
        // if there are any errors, return the error before anything else:
        if (err) return done(err);

        // if no user is  found...
        if (!user) return done(null, false, req.flash('loginMessage', 'User not found'));
          // ^ req.flash is the way to set flashdata using connect-flash

        //if the user is found but the password is wrong
        if (!user.validPassword(password)) return done(null, false, req.flash('loginMessage', 'Incorrect password'));

        //If all is well...
        return done(null, user);
      });
      */

      query.newQuery("SELECT u.email FROM users u WHERE u.email LIKE '" + email + "';", function(error, data) {
        // if there are any errors, return the error before anything else:
        if (error) return done(error);
        console.log("Data: ");
        console.log(data);
        //Checks if the user already exists
        if (data.length === 0) {
          return done(null, false, req.flash('loginMessage', 'User not found'));
          // ^ req.flash is the way to set flashdata using connect-flash
        }



        var valid;
        query.newQuery("SELECT * FROM users u WHERE u.email LIKE '" + email + "';", function(err, data) {
          //data should contain the password
          console.log("Data: ");
          console.log(data);
          console.log(data[0].password);
          console.log("Your password: " + password);

          if (loginquery.validPassword(email, password, data)) {
            console.log("Correct password. Data: ");
            console.log(data);
            //If all is well...
            return done(null, data[0]);
          }
          else {
            console.log(loginquery.validPassword(email, password));
            console.log("Password incorrect.");
            return done(null, false, req.flash('loginMessage', 'Incorrect Password.'));
          }
        });

        //if (!loginquery.validPassword(email, password)) {
        //  console.log(loginquery.validPassword(email, password));
        //  console.log("Password incorrect.");
        //  return done(null, false, req.flash('loginMessage', 'Incorrect Password.'));
        //}

      });

  }));
};
