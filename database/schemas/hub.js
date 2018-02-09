var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	hubSchm = new schema({
		name: String,
		address: String,
		approvalList: Array,
		gststatus: String,
		gstno: String,
		createdDate: Date,
		updatedDate: Date,
		isActive: Boolean
	});

module.exports = mongoose.model('hubs',hubSchm);