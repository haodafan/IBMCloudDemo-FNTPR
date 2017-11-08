var query = require('./query.js');
var schema = "ibmx_a49d9433f2a2931"
module.exports = {
  returnTable: function(tableName, callback) {
    query.newQuery("SELECT * FROM" + schema + "." + tableName + ";", function(err, data) {
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
