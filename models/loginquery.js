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
    //   console.log(bcryptcomparesync);
      return bcryptcomparesync;
    // });
  },

  // This will create an object with THREE VALUES
  // {token, username, expiry}
  generateTokenObject: function() {
    return;
  },

  // This will return a boolean
  validToken: function (tokenObject) {
    return;
  }

  // Wait how do u verify if a token has expired?
  // Do I need to create another database table for tokens?
  // Ugh how do I do this
}
