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
    callback(tokenObject);
  },

// TEMPORARY PLS REMOVE LATER
// CREATE TABLE token (ID INT(11) PRIMARY KEY, userId INT(11), token VARCHAR(256), expiry INT(11)); // TABLE CREATED!!!
//



  // This will return a boolean
  isValidToken: function (tokenObject) {
    console.log("Verifying the validity of this token...");

  },

  //This will go through the token table, deleting all expired tokens
  purgeTokens: function() {

  }

  // Wait how do u verify if a token has expired?
  // Do I need to create another database table for tokens?
  // Ugh how do I do this
}
