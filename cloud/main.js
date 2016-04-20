// Twilio Credentials 
var accountSid = 'AC8b3e03e43b5ddf2ecbfa3ce7f23f7359'; 
var authToken = '88444b31b38ee715cef8e90cb428e6dd'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
 
Parse.Cloud.define("sendVerificationCode", function(request, response) {
    var verificationCode = Math.floor(Math.random()*999999);
    var user = ParseUser.getCurrentUser();
    user.put("phoneNumber", request.params.phoneNumber);
    user.put("phoneVerificationCode", verificationCode);
    user.save();
    
	client.messages.create({ 
    	to: request.params.phoneNumber,
	    from: "+16692365277", 
    	body: "Your verification code is " + verificationCode + ".",
	    mediaUrl: "http://farm2.static.flickr.com/1075/1404618563_3ed9a44a3a.jpg",  
	}, function(err, message) { 
    console.log(message.sid); 
        if (err) {
          response.error(err);
        } else { 
          response.success("Success");
        }
	});
});

Parse.Cloud.define("verifyPhoneNumber", function(request, response) {
    var user = ParseUser.getCurrentUser();
    var phoneNumber = user.getString("phoneNumber");
    var verificationCode = user.getInteger("phoneVerificationCode");
    if (phoneNumber == request.params.phoneNumber && 
    		verificationCode == request.params.phoneVerificationCode) {
        user.put("phoneVerified", true);
        user.save();
        response.success("Success");
    } else {
        response.error("Invalid verification code.");
    }
});
