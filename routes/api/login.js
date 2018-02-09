var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	validator = require("email-validator"),
	users = require('../../database/schemas/user.js');

function checkUserExistance(req,res,next){
	console.log(req.body);
	if(req.body){
		let email = req.body.email.trim() || '';

		if(validator.validate(email)){
			users.findOne({email:email},'email password',function(err,user){
				if(err){
					res.status(500).send('Internal Server Error !');
					return;
				}
				req.user = user;
				next();
			});
		}
		else{
			res.status(200).send({
				code:2,
				message: 'Invalid Email !'
			});
		}
	}
}

function saveDistinctUser(req,res,next){
	if(req.body){
		console.log(req.user);
		if(!_.isEmpty(req.user)){
			res.status(200).send({
				code:1,
				message: 'User already Exist !'
			});
		}
		else{
			let userData = new users(req.body);
			userData.createdAt = new Date();
			userData.isActive = true;
			userData.save(function(err,docs){
				if (err) {
					res.status(500).send('Internal Server Error !');
					return;
				}
				res.status(200).send({
					code:0,
					message: 'user stored successfully !',
					userId: docs._id
				});
			})
		}
		
	}
}

function matchLoginCredential(req,res,next){
	if(req.body){
		if(!_.isEmpty(req.user)){
			console.log(req.user);
			let enteredPassword = req.body.password || '',
				userPassword = req.user.password || ''
			if(enteredPassword === userPassword){
				res.status(200).send({
					code:0,
					message: 'success !',
					userInfo: req.user
				});
			}
			else{
				res.status(200).send({
					code:3,
					message: "Password mismatch !"
				});
			}
		}
		else{
			res.status(200).send({
				code:1,
				message: "Email doesn't exist !"
			});
		}
	}
}

router.get('/',function(req,res,next){
	res.json({'status':'OK'});
});

router.post('/',checkUserExistance,matchLoginCredential);

router.post('/save',checkUserExistance,saveDistinctUser);


//404 - Page not found handler.
router.use(function(err,req,res,next){
	res.json({"status":"404","err":"failed"});
})

module.exports = router;