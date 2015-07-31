(function(){

	'use strict';

	// API ROUTES

	var 	jwt = require('jsonwebtoken'),
				config = require('../config.js'),

			sentMessage, sentResponse;

	exports.quotes = require('./api/apiQuotes.js');
	exports.users = require('./api/apiUsers.js');
	exports.posts = require('./api/apiPosts.js');

	exports.methods = {
		authenticateToken: authenticateToken
	};

	function authenticateToken(req, res, next) {

		var token = req.body.token || req.query.token || req.headers['x-access-session-token'];

		if (token) {
			jwt.verify(token, config.db.secretKey, function(err, decoded){
				if (err) {
					res.send(err.message);
				} else {
					req.decoded = decoded;

					return next();
				}
			});
		} else {
			sentMessage = 'No valid token provided.';
			res.status(403).json(new config.methods.serverResponse(sentMessage, '', false));
		}
	}
})();