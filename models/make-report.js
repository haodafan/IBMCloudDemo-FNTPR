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

  createReport: function(reqBody, callback) {
    //This will take SEVERAL queries to fill out every table.
    var insertedUser = false;

    //Query 1: user
    /*
     * UserName
     * GirstNationName
     * ChiefName
     * ContactName
     * PhoneNO
     * Email
     * CreateDate
     */
     var now = new Date();
     var queryUser;
     queryUser = "INSERT INTO TABLE user (UserName, FirstNationName, ChiefName, ContactName, PhoneNO, Email, CreateDate) "
               + "(" + reqBody.userName + ", " + reqBody.fnName + ", " + reqBody.chiefName + ", "
               + reqBody.contactName + ", " + reqBody.contactPhone + ", " + reqBody.contactEmail
               + ", GETDATE());";



     //Now insert them all asynchronously
     query.newQuery(queryUser, function(err, data) {

     });



  }
}
