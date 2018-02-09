
var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	outlet = require('../../database/schemas/outlet.js');

function checkOutletExistance(req,res,next){
	if(req.body){
		var body = req.body,
			rowId = body.rowId || '';
		if(rowId){

			outlet.findOne({_id:rowId},function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
				}
				
				if(docs && !_.isEmpty(docs)){
					req.outlet = docs;
				}
				next();
			})
		}
		else{
			var name = req.body.name || '',
			regex = new RegExp(["^",name,"$"].join(""),"i");

			outlet.find({name: regex},{createdDate:false,isActive:false},function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
				}
				
				if(docs && !_.isEmpty(docs)){
					req.outlet = docs;
				}
				next();
			})
		}
	}
}
function saveDistinctOutlet(req,res,next){
	if(req.body){
		var body = req.body,
			rowId = body.rowId;
		if(rowId){

			var outletData = {
				name: body.name || '',
				address: body.address || '',
				approvalList: body.approvalList || [],
				gstno: body.gstno || '',
				tin:body.tin || '',
				hub:body.hub || '',
				outletType:body.outletType || '',
				purchaseType:body.purchaseType || '',
				updatedDate: new Date()
			};
			
			outlet.findByIdAndUpdate(rowId,{$set: outletData},{new:true},function(err,docs){
				if (err) {
					res.status(500).send("Internal server error !");
				}

				res.status(200).send({
					code: 0,
					message: 'outlet updated successfully !',
					resultId: docs._id
				});
			})
		}
		else if(req.outlet && !_.isEmpty(req.outlet)){
			res.status(200).send({
				code:1,
				message: 'User already Exist !'
			});
		}
		else{
			var outletData = new outlet(req.body);
			outletData.createdAt = new Date();
			outletData.isActive = true;

			outletData.save(function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
					return;
				}
				res.status(200).send({
					code: 0,
					message: 'outlet Stored successfully !',
					resultId: docs._id
				});
			})
		}
		
	}
}

router.post('/save',checkOutletExistance,saveDistinctOutlet);

router.delete('/delete/:rowId', function (req,res,next) {
	var rowId = req.params.rowId || '';
	if(rowId && rowId.length){
		outlet.findByIdAndRemove(rowId,function (err,docs) {
			if(err){
				res.status(500).send('Internal server error !');
			}
			res.status(200).send({
				code: 0,
				message: 'Outlet Deleted successfully !',
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
	outlet.find({},exclude,options,function(err,docs){
		if(err){
			res.status(500).send('Internal server error !');
			return;
		}
		res.status(200).send({
			code: 0,
			message: 'All outlets list !',
			list: docs
		})
	})
});


//404 - Page not found handler.
router.use(function(err,req,res,next){
	console.log('asdasdas')
	res.json({"status":"404","err":"failed"});
})
module.exports = router;