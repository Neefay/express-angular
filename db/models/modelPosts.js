(function(){
	'use strict'

	var 	mongoose = require('mongoose');

	var PostsSchema = new mongoose.Schema({
		title: { type: String, required: true },
		body: { type: String, required: true },
		_author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		tags: { type: [{ type: String }], default: [] },		
		rating: { type: Number, default: 0 },
		
		date: { type: Date, default: Date.now() }
	})

	module.exports = mongoose.model('Post', PostsSchema);
})();