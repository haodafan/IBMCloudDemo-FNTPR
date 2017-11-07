// IBM Bluemix
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();

var services = appEnv.services;
var mysql_services = services["compose-for-mysql"];

var credentials = mysql_services[0].credentials;

var connectionString = credentials.uri;

module.exports = connectionString;
