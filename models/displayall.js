var query = require('./query.js');
var schema = "ibmx_7c3d0b86c1998ef";
module.exports = {
  returnTable: function(tableName, callback) {
    query.newQuery("SELECT * FROM " + schema + "." + tableName + ";", function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(data);

        var strData = JSON.stringify(data);

        return callback(strData);
      }
    });
  },

  // THIS FUNCTION CALLS BACK A FUNCTION WITH AN ENTIRE ROW OF A TABLE WITH A SPECIFIC ID
  returnRow: function(table, id, callback) {
    var strQuery = "SELECT * FROM " + table + " WHERE " + table + ".ID = " + id ";";
    query.newQuery(strQuery, function(err, data) {
      if (err) throw err;
      callback(err, data);
    });
  },

  // THIS FUNCTION RETURNS ALL PRIMARY KEY IDs ASSOCIATED WITH A FOREIGN KEY ID
  returnId: function(table, foreignIdName, foreignId, callback) {
    var strQuery = "SELECT ID FROM " + table + " WHERE " + table + "." + foreignIDName + " = " + foreignId ";";
    query.newQuery(strQuery, function(err, data) {
      if (err) throw err;
      callback(err, data);
    });
  }
}
