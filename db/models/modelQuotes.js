
var 	mongoose = require('mongoose');

var QuoteSchema = new mongoose.Schema({
	body: { type: String, required: true},
	author: {type: String, required: true, default: 'Anonymous' },
	date: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('Quote', QuoteSchema);