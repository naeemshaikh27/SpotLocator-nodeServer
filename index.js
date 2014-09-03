var express = require('express'),
	 cors = require('cors'),
 	 mysql =  require('mysql');
  var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');

 var bodyParser = require('body-parser');
 
 // for sending smtp mail create transporter
var transporter = nodemailer.createTransport(smtpTransport({
   /* host: 'secure.emailsrvr.com',
    port: 465,
    secure: true,   // for other services
    */
   service: 'gmail',// for well Known services
    auth: {
        user: 'naeemshaikh27@gmail.com',
        pass: 'Spartain27@'
    },
    maxConnections: 5,
    maxMessages: 10
}));
  
  
  // create express app server
   app = express();

app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() );

/*  product service */
app.post('/products', function(req, res, next){
		
	var responseString="";
	 
	  var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		  port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();

	console.log("connected to products database");
	var strQuery="select * from description where code='"+ req.body.name+"';";
	 connection.query( strQuery, function(err, rows){
  	if(err)	{
		res.json({
		 "status":false
		});
		res.end();
  		
  	}else{
  		if(rows.length>0)// data found in database
  		{
  				console.log("rows="+rows.length);
  		console.log( "lon="+rows[0].lon+"lat"+rows[0].lat );
  		
  		 res.json( {
					 "status":true,
					"lat":rows[0].lat ,
					"lon":rows[0].lon,
					"code":rows[0].code,
					"name":rows[0].name,
					"description":rows[0].description
					});
		res.end();

  		}else{ // no rows found
  			
  			res.json( {
		 				"status":false
					});
			res.end();
  			}	
  	}
  });
	

 connection.end();

});


/* login service */

app.post('/login', function(req, res, next){
	
	
	   var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();
	
	
	console.log("connected to login database");
	var strQuery="select password from login where uname='"+req.body.uname+"';";
	 connection.query( strQuery, function(err, rows){
  	if(err)	{
  		res.json({
				 "status":false
				});
		res.end();
  	}else{
  	if(rows.length>0)// data found in database
  		{
  			if(rows[0].password==req.body.password)
  			{
  				 res.json({"status":true });
  			}
  			else{
  				res.json({
					 "status":false
					});
					res.end();
  			}
  		
  		}
  		else{
  			res.json({
					 "status":false
					});
					res.end();
  		}
  		
  		
 		
  	}
  });
	
	
 connection.end();

});



/* sing up service */

app.post('/signup', function(req, res, next){
	
	var obj={
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  };
	  
	   var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();
	
	
	console.log("connected to login database");
	var strQuery="insert into login values('"+req.body.uname+"','"+req.body.password+"','"+req.body.name+"','"+req.body.mobile+"');";
	 connection.query( strQuery, function(err){
  	if(err)	{
  		res.json({
				 "status":false,
				 "error":err,
				 "obj":JSON.Stringify(obj)
				});
		res.end();
  	}else{

  		res.json({"status":true });
 		res.end();
 		
  	}
  });
	
	
 connection.end();

});





/* forgot password service */

app.post('/forgot', function(req, res, next){
	
	
	   var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();
	
	
	console.log("connected to login database");
	var strQuery="select password from login where uname='"+req.body.uname+"';";
	 connection.query( strQuery, function(err,rows){
  	if(err)	{
  		res.json({
				 "status":false
				});
		res.end();
  	}else{


			if(rows.length>0){
		// send email to uname
		
			var mail = {
		    from: "naeem.shaikh@synechron.com",
		    to: req.body.uname,
		    subject: "Spot Locator Password",
		    text: "",
		    html: "<p>Hi "+req.body.uname+"</p><p>Yor Password for Spot Locator is <b> "+rows[0].password+"</b></p>"
		};
		
		transporter.sendMail(mail, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		    }
		});
  		res.json({"status":true });
  		res.end();
 		
 	}else{
 		res.json({
					 "status":false
					});
					res.end();
 	}
  	}
  });


connection.end();
});



/* Add location service */

app.post('/addLoc', function(req, res, next){
	
	
	var a;
	var Generatedcode="";
	for(i=0;i<5;i++)
	{
		
		a=Math.round(Math.random()*25);
	Generatedcode=Generatedcode+String.fromCharCode(a+97);
	}
	
	console.log(Generatedcode);
 
	   var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();
	
	
	console.log("connected to description database");
	var strQuery="insert into description values('"+req.body.uname+"','"+req.body.lat+"','"+req.body.lon+"','"+Generatedcode+"','"+req.body.name+"','"+req.body.description+"');";
	console.log(strQuery);
	 connection.query( strQuery, function(err){
  	if(err)	{
  		console.log(err);
  		res.json({
				 "status":false
				});
		res.end();
  	}else{
  
  		res.json({
				 "status":true,
				 code:Generatedcode
				});
		res.end();
  		console.log("data sent");
 		
  	}
  });
	
	connection.end();
 

});




/* My Places service */

app.post('/places', function(req, res, next){
	
	

	   var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();
	
	
	console.log("connected to description database uname="+req.body.uname);
	var strQuery="select * from description where uname='"+req.body.uname+"';";
	console.log(strQuery);
	 connection.query( strQuery, function(err,rows){
  	if(err)	{
  		console.log(err);
  		res.json({
				 "status":false
				});
		res.end();
  	}else{
  console.log("success");
  		  	if(rows.length>0)// data found in database
  			{
  			
  					res.json({
					 "status":true,
					 "data":rows
					}); 
  					res.end();
  			}
  			else{
  				res.json({
					 "status":false
					});
					res.end();
  		}
 		
  	}
  });
	
	
 connection.end();

});












/* sing up service */

app.post('/delete', function(req, res, next){
	
	
	 
	    var connection =  mysql.createConnection({
  		 host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
		   port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
         user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
         password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
         database : process.env.OPENSHIFT_GEAR_NAME
	
  });
	connection.connect();
	
	
	console.log("connected to description database");
	 
	var strQuery="DELETE FROM description WHERE code='"+req.body.code+"';";
	 connection.query( strQuery, function(err){
  	if(err)	{
  		res.json({
				 "status":false
				});
		res.end();
  	}else{

  		res.json({"status":true });
 		res.end();
 		
  	}
  });
	connection.end();
	
 

});



/* learn */

app.get('/demo', function(req, res, next){
	
	
	
  		res.send("text");
		res.end();
  
	
 

});







app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
process.env.OPENSHIFT_NODEJS_IP);