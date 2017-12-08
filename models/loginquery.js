var mysql = require('mysql');
var databasejs = require('../config/database')
var bcrypt = require('bcrypt-nodejs');

var db = require('./query');

module.exports = {
  generateHash: function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },

  validPassword: function(email, password, data) {
    //db.newQuery("SELECT password FROM users u WHERE u.email LIKE '" + email + "';", function(err, data) {
      // //data should contain the password
      // console.log("Data: ");
      // console.log(data);
      // console.log(data[0].password);
      // console.log("Your password: " + password);

      var bcryptcomparesync = bcrypt.compareSync(password, data[0].password);
      //  console.log(bcryptcomparesync);
      return bcryptcomparesync;
    // });
  },

  // This will create an object with THREE VALUES
  // {token, userID, expiry}
  generateTokenObject: function(userID, countdownMinutes, callback) {
    var currentDate = new Date(); //How to get current datetime??? :'(

    var expiryMiliseconds = countdownMinutes * 60 * 1000;
    var expiryDate = new Date(currentDate.getTime() + expiryMiliseconds);
    console.log("Current Date: ");
    console.log(currentDate);
    console.log("Expiring Date: ");
    console.log(expiryDate);

    var hashToken = bcrypt.hashSync(userID + currentDate.getTime() + "some_string-lmao", bcrypt.genSaltSync(1), null);
    var tokenObject = {token: hashToken, ID: userID, expiry: expiryDate.getTime()};

    //DO A QUICK PURGE
    module.exports.purgeTokens(function () {
      module.exports.purgeAccounts(function() {
        console.log("PURGE'D.");
        callback(tokenObject);
      });
    });
  },

  // This will return a boolean
  isValidToken: function (tokenObject) {
    console.log("Verifying the validity of this token...");

  },

  //This will go through the token table, deleting all expired tokens
  purgeTokens: function(callback) {
    rightNow = new Date();

    //Select every date where the expiry date is smaller (earlier) than right now
    db.newQuery("SELECT ID FROM token WHERE expiry < " + rightNow.getTime() + ";", function(err, data) {
      if (data.length == 0) callback();
      //Now, delete them all!
      for (var i = 0; i < data.length; i++) {
        var deleteDIS = "DELETE FROM token WHERE ID = " + data[i].ID + ";";
        db.newQuery(deleteDIS, function(err, data2) {
          console.log("TOKEN DELETED!!!");
          console.log(data2);
          callback();
        });
      }
    });

  },

  //This will go through and delete all accounts that neither have a token nor are validated.
  purgeAccounts: function (callback) {
    rightNow = new Date();

    //select every user who is not validated
    db.newQuery("SELECT ID FROM user WHERE Validated = 0;", function(err, data) {
      if (data.length == 0) callback();
      for (var i = 0; i < data.length; i++) {
        //Find out if each one has a token
        db.newQuery("SELECT * FROM token WHERE UserID = " + data[i].ID, function(err, data2) {
          if(data2.length < 0) {
            //That means there's no token! DELETE DIS
            var deleteDIS = "DELETE FROM user WHERE ID = " + data[i].ID + ";";
            db.newQuery(deleteDIS, function(err, data3) {
              console.log("USER DELETED!!!");
              console.log(data2);
              callback();
            });
          }
        });

      }
    });
  }
}
