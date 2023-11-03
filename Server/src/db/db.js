var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jarvo",
  database:'healthcare',
  port:3306


});

db.connect(function(err) {
  if(err){
    console.log('check your connections');
  }
  else{
    console.log("Connected!");
  }

});

module.exports = db