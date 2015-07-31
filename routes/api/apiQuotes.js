(function(){
	'use strict';

	var 	express = require('express'),
			mongoose = require('mongoose'),

			config = require('../../config.js');
			
	// REQUIRE ALL MODELS
			
	var Quote = require('../../db/models/modelQuotes.js');

	exports.getQuotes = getQuotes;
	exports.addQuote = addQuote;
	exports.removeQuote = removeQuote;

	function getQuotes(req, res) {

		Quote.find({}, function (err, quotes) {
			
			if (err) return res.send(err.message);
			
			res.json(quotes);
		});
	}

	function addQuote(req, res) {

		var quote = new Quote({
			body: req.body.quote,
			author: req.body.author,
			date: Date.now()
		});

		quote.save(function (err, quote) {
			if (err) {
				console.error('ERROR SAVING TO THE DATABASE!');
				res.send(err.message);
			}
			console.log('Saved quote (' + quote + ') successfully into the database.');
			res.json(req.body);
		});
	}

	function removeQuote(req, res) {

		var id = req.params.id;

		Quote.findByIdAndRemove(id, function(err) {
			if (err) {
				console.error('ERROR REMOVING!');
				res.send(err.message);
			}
		});

		console.log('Removed quote with ID ' + id + ' from database.');
		res.json(req.body);
	}
})();