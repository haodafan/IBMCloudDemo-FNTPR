var query = require('./query.js');
var schema = "ibmx_7c3d0b86c1998ef"
module.exports = {
  returnTable: function(tableName, callback) {
    query.newQuery("SELECT * FROM " + schema + "." + tableName + ";", function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(data);
        return callback(data);
      }
    });
  }
}
