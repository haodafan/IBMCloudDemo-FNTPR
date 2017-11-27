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
  // ======================================
  // DEBUGGING ROUTES =====================
  // ======================================
  app.get('/make-query', function(req, res) {
    res.render('querydatabase.ejs', {data: "no data"});
  });
  app.post('/make-query', function(req, res) {
    console.log("/make-query post route function INVOKER");

    /*
    console.log("FIRST LETS MAKE SURE THE TEXTAREA WORKS");
    console.log(req.body.userQuery);

    strQuery = JSON.stringify(req.body.userQuery);

    res.render('querydatabase.ejs', {data: strQuery});

     */
    var query = require('../models/query');
    console.log(req.body.userQuery);
    query.newQuery(req.body.userQuery, function(err, result) {
      if (err) {
        console.log(err);
      }
      strResult = JSON.stringify(result);
      res.render('querydatabase.ejs', {data: strResult});
    });

  });


  app.get('/test', function(req, res) {
    //COMMENT OUT AFTER DEBUGGING TABLES
    res.render('test.ejs', {data: "no data"});
  });

  app.post('/test', function(req, res) {
    console.log("/test post route function INVOKED");
    //console.log(" =========================================== --- REQ --- =========================================== ");
    //console.log(req);
    //console.log(" =========================================== --- RES --- =========================================== ");
    //console.log(res);
    var displayAll = require('../models/displayall');
    displayAll.returnTable(req.body.table, function(result) {
      res.render('test.ejs', {data: result})
    });
  });


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
    console.log("app get '/login'");
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
    console.log("app get /signup");
    console.log(req.body);
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/signup-next',
      failureRedirect : '/signup',
      failureFlash : true //allows flash messages
    }));

// process another signup form
  app.get('/signup-next', isLoggedIn, function(req, res) {
    console.log("app get /signup-next");
    console.log(req.body);
    console.log("=============================================================");
    console.log(req.user);
    console.log("RENDERING NEW PAGE");
    res.render('signup2.ejs', {message: req.flash('signupMessage')});
  });
  app.post('/signup-next', isLoggedIn, function(req, res) {
    console.log("app post /signup-next");
    console.log(req.body);
    console.log("=============================================================");
    console.log(req.user);
    var make = require('../models/make-report.js');
    make.createUserProfile(req.body, req.user, function() {
      console.log("SUCCESS!");
      res.redirect('/profile');
    });
  });

  // =====================================
  // PROFILE =============================
  // =====================================

  app.get('/profile', isLoggedIn, function(req, res) {
    //DEBUGGING
    console.log(req.user);
    var query = require('../models/query.js');
    query.newQuery("SELECT id FROM funding f WHERE f.userId = " + req.user.ID, function(err, data) {
      var isReport;
      if (data.length > 0) {
        isReport = true;
      }
      else {
        isReport = false;
      }
      res.render('profile.ejs', {
        user : req.user, // get the user out of session and pass to template
        isReport : isReport
      });
    })

  });

  // =====================================
  // NEW FORM ============================
  // =====================================
  app.get('/make-report', isLoggedIn, function(req, res) {
    console.log("/make-report get route function INVOKED");
    console.log("Let's make a new report.");
    res.render('form.ejs', {user: req.user});
  });

  app.post('/make-report', isLoggedIn, function(req, res) {
    console.log("/make-report post route function INVOKED");
    var make = require('../models/make-report.js');

    console.log("Pass in this variable: ");
    console.log(req.body);
    console.log("Pass in this variable as well: ");
    console.log(req.user);
    make.createReport(req.body, req.user, function() {
      console.log("SUCCESS!");
      res.redirect('/profile');
    });
  });
  // =====================================
  // VIEW FORM ===========================
  // =====================================
  app.get('/view-report', isLoggedIn, function(req, res) {
    console.log("get /view-report")
    // TBH THIS COULD PROBABLY BE ITS OWN MODULE BUT FOR NOW I'LL LEAVE IT HERE
    //var display = require('../models/displayall.js');
    var query = require('../models/query.js')
    // This is a several step process:
    // 1. Get data for user profile
    // 2. Get data for basic funding report
    // 3. Get data for the list of funding administration
    // 4. Get data for the list of funding uses

    // 1 - USER PROFILE
    query.newQuery("SELECT * FROM user WHERE user.ID = " + req.user.ID + ";", function(err, dataUser) {
      if (err) {
        console.log(err);
      }
      else {
        // 2 - BASIC FUNDING REPORT
        query.newQuery("SELECT * FROM funding WHERE funding.UserId = " + req.user.ID + ";", function(err, dataFunding) {
          if (err) {
            console.log(err);
          }
          else {
            //3 - Funding Administration
            console.log("This funding table id: ");
            console.log(dataFunding[0].ID);
            var admin = [false, false, false, false, false];
            query.newQuery("SELECT * FROM funding_administor WHERE FundingID = " + dataFunding[0].ID + " ORDER BY LKPFundingAdministorID;", function(err, dataAdmin) {
              if (err) {
                console.log(err);
              }
              else {
                console.log("dataAdmin: ");
                console.log(dataAdmin);
                console.log("first element: ");
                console.log(dataAdmin[0]);
                console.log("third element: ");
                console.log(dataAdmin[2]); //NOTE THIS WORKS BUT DATAITEM DOES NOT
                for (var i = 0; i < dataAdmin.length; i++) {
                  admin[(dataAdmin[i].LKPFundingAdministorID - 1)/10] = true;
                }

                console.log("admin: ");
                console.log(admin);

                //4 - Funding Use
                var use = [false, false, false, false, false, false, false, false, false]
                var comments;
                query.newQuery("SELECT * FROM funding_use WHERE FundingID = " + dataFunding[0].ID + " ORDER BY LKPFundingUseID;", function(err, dataUse) {
                  if (err) {
                    console.log(err);
                  }
                  else {
                    for (var i = 0; i < dataUse.length; i++) {
                      use[(dataUse[i].LKPFundingUseID - 1) / 10] = true;
                    }
                    console.log("Use: ");
                    console.log(use);

                    //NOW WE RENDER THE PAGE WITH ALLLLLLLL THE DATA
                    res.render('view-report.ejs', {
                      user : dataUser[0],
                      rep : dataFunding[0],
                      admin : admin,
                      use : use,
                      other: comments
                    });
                  }
                });
              }
            });

          }
        });
      }
    });


  });

  //THIS IS FOR DEBUGGING PURPOSES
  //COMMENT OUT IN FINAL DEMO
  /*
  */
  app.get('/delete-all-data-from-table-user', function(req, res) {
    var query = require('../models/query.js');
    query.newQuery("DELETE FROM user", function(req, res) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("DELETED.");
        res.redirect('/');
      }
    });
  });
  app.get('/delete-all-data-from-table-funding', function(req, res) {
    var query = require('../models/query.js');
    query.newQuery("DELETE FROM funding", function(req, res) {
      console.log("DELETED.");
      res.redirect('/');
    });
  });
  // DEBUGGING


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
