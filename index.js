var express = require('express'),
	 cors = require('cors'),
 	 mysql =  require('mysql');
  var nodemailer = require("nodemailer");

 var bodyParser = require('body-parser');

  
  
  // create express app server
   app = express();

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() );



/* learn */

app.get('/demo', function(req, res, next){
	
	
	
  		res.send("text");
		res.end();
  
	
 

});






app.listen(process.env.OPENSHIFT_NODEJS_PORT || 80, function(){
  console.log('CORS-enabled web server listening on port 80');
});