var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	userSchema = require('../database/schemas/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({"status":"OK"});
});

//404 - Page not found handler.
router.use(function(req,res,next){
	res.json({"status":"failed","err":"404"});
});



module.exports = router;
