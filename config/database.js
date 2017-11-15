/*
var connectionString = `{
  host: "us-cdbr-sl-dfw-01.cleardb.net",
  user: "bdafd0d63c5f0e",
  password: "3f005520",
  schema: "ibmx_7c3d0b86c1998ef"
}`
module.exports = connectionString;
*/
// IBM Bluemix
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

var services = appEnv.services;
var mysql_services = services["cleardb"];

var credentials = mysql_services[0].credentials;

var connectionString = credentials.uri;

module.exports = connectionString;
