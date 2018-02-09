
var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	hub = require('../../database/schemas/hub.js');

function checkHubExistance(req,res,next){
	if(req.body){
		var body = req.body,
			rowId = body.rowId || '';
		if(rowId){

			hub.findOne({_id:rowId},function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
				}

				if(docs && !_.isEmpty(docs)){
					req.hub = docs;
				}
				next();
			})
		}
		else{
			var name = req.body.name || '',
			regex = new RegExp(["^",name,"$"].join(""),"i");

			hub.find({name: regex},{createdDate:false,isActive:false},function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
				}

				if(docs && !_.isEmpty(docs)){
					req.hub = docs;
				}
				next();
			})
		}
	}
}
function saveDistinctHub(req,res,next){
	if(req.body){
		var body = req.body,
			rowId = body.rowId;
		if(rowId){

			var hubData = {
				name: body.name || '',
				address: body.address || '',
				approvalList: body.approvalList || [],
				gstno: body.gstno || '',
				updatedDate: new Date()
			};

			hub.findByIdAndUpdate(rowId,{$set: hubData},{new:true},function(err,docs){
				if (err) {
					res.status(500).send("Internal server error !");
				}

				res.status(200).send({
					code: 0,
					message: 'Hub updated successfully !',
					resultId: docs._id
				});
			})
		}
		else if(req.hub && !_.isEmpty(req.hub)){
			res.status(200).send({
				code:1,
				message: 'Hub already Exist !'
			});
		}
		else{
			var hubData = new hub(req.body);
			hubData.createdAt = new Date();
			hubData.isActive = true;

			hubData.save(function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
					return;
				}
				res.status(200).send({
					code: 0,
					message: 'Hub stored successfully !',
					resultId: docs._id
				});
			})
		}

	}
}

router.post('/save',checkHubExistance,saveDistinctHub);

router.delete('/delete/:rowId', function (req,res,next) {
	var rowId = req.params.rowId || '';
	if(rowId && rowId.length){
		hub.findByIdAndRemove(rowId,function (err,docs) {
			if(err){
				res.status(500).send('Internal server error !');
			}
			res.status(200).send({
				code: 0,
				message: 'Hub Deleted successfully !',
				resultId: docs._id
			})
		})
	}
});

router.get('/', function(req,res,next){
	var exclude = {
		__v:false,
		createdAt:false
	},
	options = {
		sort:{name:1}
	},
	data = {};
	hub.find({},exclude,options,function(err,docs){
		if(err){
			res.status(500).send('Internal server error !');
			return;
		}
		res.status(200).send({
			code: 0,
			message: 'All hubs list !',
			list: docs
		})
	})
});


module.exports = router;
