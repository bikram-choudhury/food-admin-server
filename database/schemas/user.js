var mongoose = require('mongoose'),
	schema = mongoose.Schema,
	userSchm = new schema({
		name: String,
		email: String,
		password: String,
		termsAgreement: Boolean,
		createdAt: Date,
		isActive: Boolean
	});

module.exports = mongoose.model('users',userSchm);