var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	tax = new schema({
		name: String,
		mstrTyp: String,
		grp: Boolean,
		prcnt: String,
		grpTaxLst: Array,
		createdAt: Date,
		updatedAt: Date,
		isActive: Boolean
	});

module.exports =  mongoose.model('taxList',tax);
