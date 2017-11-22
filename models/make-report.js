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
  },

  createReport: function(reqBody, reqUser, callback) {
    //This will take SEVERAL queries to fill out every table.
    console.log("CREATE REPORT CALLED.");
     //Query 2: funding
     /*
      * Year
      * FundingProvided
      * FundingSpent
      * SourceFromHomeMaking
      * SourceFromFirstNation
      * NumberOfClientServed
      * HomeCarePriorities
      * Comments
      * Approved
      * SubmitDate
      */

     // SOME BOOLEAN => TINYINT CONVERSION
     var queryFunding;
     var sourcefromhome = "0";
     var sourcefromgov = "0";
     var approved = "0";
     if (reqBody.fundNursing === "on") {
       sourcefromhome = "1";
     }
     if (reqBody.fundGov === "on") {
       sourcefromgov = "1";
     }
     if (reqBody.approval ===  "on") {
       approved = "1";
     }

     queryFunding = "INSERT INTO funding (userID, Year, FundingProvided, FundingSpent, SourceFromHomeMaking, SourceFromFirstNation, NumberOfClientServed, HomeCarePriorities, Comments, Approved, SubmitDate) VALUES "
     + "(" + reqUser.ID + "2017" + ", " + reqBody.fundProvided + ", " + reqBody.fundSpent + ", " + sourcefromhome
     + ", " + sourcefromgov + ", " + reqBody.numClients + ", '" + reqBody.priorities + "', '" + reqBody.comments
     + "', " + approved + ", NOW());";

     //NOT TOO SURE WHAT TO PUT IN ANY OF THE OTHER TABLES T B H

     //Now insert them all!
     var doneUser = false;
     var doneFunding = false; //these flags are currently useless, what was I even thinking? :O

     //FIRST QUERY!
     /*
     query.newQuery(queryUser, function(err, data) {
       console.log("USER QUERY STARTED!");
       if (err) {
         console.log(err);
       }
       else {
         console.log("DATA: ");
         console.log(data);
         doneUser = true;
         */
         //SECOND QUERY!
         query.newQuery(queryFunding, function(err, data) {
           console.log("FUNDING QUERY STARTED!")
           if (err) {
             console.log(err);
           }
           else {
             console.log("DATA 2: ");
             console.log(data);
             doneFunding = true;


             //FINAL QUERY!!!
             query.newQuery("UPDATE auth.report SET auth.report = TRUE WHERE auth.id = '" + reqUser.id  + "'", function(err, data) {
               console.log("Auth should have been updated.");
                 callback();
             });

           }
         });
      // }
    //});
  },
  createUserProfile: function(reqBody, reqUser, callback) {
    console.log("CREATE USER PROFILE CALLED.");
      //Query 1: user
      /*
       * UserName [x]
       * FirstNationName
       * ChiefName
       * ContactName
       * PhoneNO
       * Email
       * CreateDate
       * Password [x]
       */
       /*
       var now = new Date();
       var queryUser;
       queryUser = "INSERT INTO user (UserName, FirstNationName, ChiefName, ContactName, PhoneNO, Email, CreateDate) "
                 + " VALUES ('" + reqBody.userName + "', '" + reqBody.fnName + "', '" + reqBody.chiefName + "', '"
                 + reqBody.contactName + "', " + reqBody.contactPhone + ", '" + reqBody.contactEmail
                 + "', NOW());";

      */
      var queryUser;
      queryUser = "UPDATE user SET FirstNationName = '" + reqBody.fnName + "', ChiefName = '" + reqBody.chiefName + "', "
                  + "ContactName = '" + reqBody.contactName + "', " + "PhoneNO = '" + reqBody.contactPhone + "', "
                  + "Email = '" + reqBody.contactEmail + "' WHERE UserName = '" + reqUser.UserName + "';"; //UNFINISHED

      query.newQuery(queryUser, function(err, data) {
        console.log("USER QUERY UPDATE STARTED.");
        if (err) {
          console.log(err);
        }
        else {
          console.log("DATA: ");
          console.log(data);
          callback();
        }
      });
  }
}
