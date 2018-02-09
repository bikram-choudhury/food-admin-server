
var express = require('express'),
	router = express.Router(),
	_ = require('underscore'),
	tax = require('../../database/schemas/tax.js');

function checkTaxExists(req,res,next) {
	if(req.body){
		var data = req.body,
				rowId = data.rowId || '';
		if(rowId){
			tax.findOne({_id:rowId},function(err,docs){
				if(err){
					res.status(500).send('Internal Server Error !');
				}

				if(docs && !_.isEmpty(docs)){
					req.tax = docs;
				}
				next();
			})
		}
		else{
			var name = data.name || '',
				regex = new RegExp(["^",name,"$"].join(""),"i");
			tax.find(
				{name:regex},
				{createdDate:false,isActive:false},
				function (err,docs) {
					if(err){
						res.status(500).send('Internal Server Error !');
					}
					if(docs && !_.isEmpty(docs)){
						req.tax = docs;
					}
					next();
			})

		}
	}
}

function saveDistinctTax(req,res,next) {
	console.log(JSON.stringify(req.body));
	if(req.body){
		var data = req.body,
			rowId = data.rowId;
		if(rowId){
			var taxData = {
				name: data.name || '',
				prcnt: data.prcnt || '',
				mstrTyp: data.mstrTyp || '',
				grp: data.grp || '',
				updatedDate: new Date()
			};
			if(taxData.grp){
				taxData.grpTaxLst = data.grpTaxLst
			}

			tax.findByIdAndUpdate(rowId,{$set: taxData},{new:true},function(err,docs){
				if (err) {
					res.status(500).send("Internal server error !");
				}

				res.status(200).send({
					code: 0,
					message: 'Tax updated successfully !',
					resultId: docs._id
				});
			})
		}
		else if(req.tax && !_.isEmpty(req.tax)){
			res.status(200).send({
				code:1,
				message: 'Tax already Exist !'
			});
		}
		else{
			var taxData = new tax(data);
			taxData.createdAt = new Date();
			taxData.isActive = true;
			taxData.save(function(err,docs) {
				if(err){
					res.status(500).send('Internal Server Error !');
				}
				res.status(200).send({
					code: 0,
					message: 'Tax Stored successfully !',
					resultId: docs._id
				});
			})
		}
	}
}

router.post('/save',checkTaxExists,saveDistinctTax);

router.get('/:search_query', function(req,res,next){
	var exclude = {
		__v:false,
		createdAt:false
	},
	option = {
		sort:{name:1}
	},
	query = {};
	if(req.params.search_query === 'not-grp'){
		query = {
			grpTaxLst:{$exists: false},
			grp:false
		};
	}
	tax.find(query,exclude,option,function(err,docs){
		if(err){
			res.status(500).send('Internal Server Error !');
		}
		res.status(200).send({
			code: 0,
			message: 'All tax list !',
			list: docs
		})
	})
})
router.delete('/delete/:rowId',function (req,res,next) {
	var rowId = req.params.rowId || '';
	if(rowId){
		tax.findByIdAndRemove(rowId,function(err,docs){
			if(err){
				res.status(500).send("Internal Server Error !")
			}
			res.status(200).send({
				code: 0,
				message: 'Tax Deleted successfully !',
				resultId: docs._id
			})
		})
	}
})

//404 - Page not found handler.
router.use(function(err,req,res,next){
	res.json({"status":"404","err":"failed"});
})

module.exports = router;
