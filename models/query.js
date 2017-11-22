var mysql = require('mysql');
var databasejs = require('../config/database');
//OLD
//var connection = mysql.createConnection(databasejs);

//NEW
var connectionPool = mysql.createPool(databasejs);

module.exports = {
  newQuery: function(query, callback) {
    // THIS NEW FUNCTION SHOULD THEORETICALLY STOP ANY 'SERVER CLOSED CONNECTION' ERRORS
    connectionPool.getConnection(function(err, connection) {
      if (err) throw err;
      console.log("NEW QUERY FUNCTION CALLED.");
      console.log("QUERY: ");
      connection.query(query, function(error, data) {
        if (error) {
          connection.release();
          console.error(error);
          callback(error, data);
        }
        else {
          console.log("Query success: " + query);
          console.log(data);
          connection.release();
          callback(error, data);
        }
      });
    });



    /*
    // OLD
    //Connection.connect ensures the server is always active i think
    //connection.connect(function(err) {
      console.log("NEW QUERY FUNCTION CALLED.");
      console.log("QUERY: ");
      console.log(query);
      connection.query(query, function(error, data) {
        if (error) {
          console.log(error);
          //if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          //  console.log("CONNECTION LOST ERROR!!! ATTEMPTING TO FIX ...");
          //  handleDisconnect(function () {
          //    newQuery(query, callback);
          //  });
          //}
          callback(error, data);
        }
        else {
          console.log("Query success: " + query);
          callback(error, data);
        }
      });
    //});
    */
  }

  // THIS FUNCTION DOES NOT WORK AND IDK WHY SO IL JUST COMMENT IT OUT I GUESS
  /*
  handleDisconnect: function(callback) {
    connection = mysql.createConnection(databasejs); //Recreate the connection, since the old one can't be reused

    connection.connect(function(err) {
      if (err) {
        console.log('error connecting to db:', err);
        setTimeout(handleDisconnect, 1000)// We introduce a delay before attempting to reconnect,
                                          // to avoid a hot loop, and to allow our node script to
                                          // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
      }
      else {
        callback();
      }
    });

    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      }                                             // connnection idle timeout (the wait_timeout
      else {                                        // server variable configures this)
        throw err;
      }
    });
  }
  */
}
