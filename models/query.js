var mysql = require('mysql');
var databasejs = require('../config/database');
var connection = mysql.createConnection(databasejs);

module.exports = {
  newQuery: function(query, callback) {
    connection.query(query, function(error, data) {
      if (error) {
        console.log(error);
        callback(error, data);
      }
      else {
        console.log("Query success: " + query);
        callback(error, data);
      }
    });
  }
}
