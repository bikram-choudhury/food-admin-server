var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	outltSchm = new schema({
		name: String,
		address: String,
		approvalList: Array,
		gststatus: String,
		gstno: String,
		tin:String,
		hub:String,
		outletType:String,
		purchaseType:String,
		createdDate: Date,
		updatedDate: Date,
		isActive: Boolean
	});

module.exports = mongoose.model('outlets',outltSchm);