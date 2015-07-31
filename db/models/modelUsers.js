(function(){
	'use strict'

	var 	mongoose = require('mongoose'),
			bcrypt = require('bcrypt-nodejs');

	var UserSchema = new mongoose.Schema({
		username: { type: String, required: true, index: { unique: true } },
		password: { type: String, required: true, select: false },
		
		name: { type: String },
		privilege: { type: Number, default: 0 },
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		
		join_date: { type: Date, default: Date.now() }
	})

	UserSchema.pre('save', savePasswordHash);
	UserSchema.methods.comparePassword = comparePassword;

	module.exports = mongoose.model('User', UserSchema);

	function savePasswordHash(next) {
		var user = this;
		
		if (!user.isModified('password')) return next();
		
		bcrypt.hash(user.password, null, null, function(err, hash) {
			if (err) return next(err);
			
			user.password = hash;
			next();
		});
	}

	function comparePassword(password) {
		var user =  this;
		
		return bcrypt.compareSync(password, user.password)
	}
})();