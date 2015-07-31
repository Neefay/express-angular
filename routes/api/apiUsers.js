(function(){
	'use strict';

	var 	express = require('express'),
			mongoose = require('mongoose'),
			jwt = require('jsonwebtoken'),

			config = require('../../config.js');

	// REQUIRE ALL MODELS

	var Users = require('../../db/models/modelUsers.js');

	exports.addUser = addUser;
	exports.getUser = getUser;
	exports.getUsers = getUsers;
	exports.removeUser = removeUser;
	exports.putUser = putUser;
	exports.authUser = authUser;
	exports.getSelf = getSelf;
	exports.getUserPosts = getUserPosts;

	// INITIALIZE RESPONSE VARIABLES

	var sentMessage, sentResponse;

	function addUser(req, res) {

		var user = new Users({
			username: req.body.username,
			password: req.body.password,
			name: req.body.name || null,
			privilege: req.body.privilege || 0
		});

		user.save(function (err, user) {
			if (err) {
				if (err.code == 11000) {
					sentMessage = 'User (' + req.body.username + ') already exists!';
					sentResponse = new config.methods.serverResponse(sentMessage, '', false);

					console.log(sentMessage);

					return res.json(sentResponse);
				} else {
					return res.json(new config.methods.serverResponse(err.message, err.message, false));
				}
			}
			sentMessage = 'Saved user (' + user.username + ') successfully.';
			sentResponse = new config.methods.serverResponse(sentMessage, user.username);

			res.json(sentResponse);
			console.log(sentMessage);
		});
	}

	function getUser(req, res) {

		Users.findOne({
			username: req.params.username
		}, function(err, user) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			if (user) {
				sentMessage = 'User (' + user.username + ') found.';
				sentResponse = new config.methods.serverResponse(sentMessage, user);
			} else {
				sentMessage = 'Could not find user (' + req.params.username + ').';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
		});
	}

	function getUsers(req, res) {

		var qPage = req.params.page - 1,
			qLimit = (qPage < 0) ? 0 : config.queries.limit;

		Users.count(function(err, count){
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			Users.find({}).skip(qLimit * qPage).limit(qLimit).exec(function(err, users) {

				if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

				if (users) {
					sentMessage = 'Returning all registered users.';
					sentResponse = new config.methods.serverResponse(sentMessage, users);
					sentResponse.decoded = req.decoded;
					sentResponse.userCount = count;
				} else {
					sentMessage = 'No registered users to be returned.';
					sentResponse = new config.methods.serverResponse(sentMessage, '', false);
				}
				res.json(sentResponse);
				console.log(sentMessage);

			});
		});
	}

	function removeUser(req, res) {

		Users.findOneAndRemove({
			username: req.params.username
		}, function(err, user) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
		
			if (user) {
				sentMessage = 'User (' + user.username + ') removed.';
				sentResponse = new config.methods.serverResponse(sentMessage, user);
			} else {
				sentMessage = 'Could not find (' + req.params.username + ').';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
			
		});
	}

	function putUser(req, res) {
	
		Users.findOne({ username: req.params.username}).select('name username password privilege').exec(function(err, user) {
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
			
			if (user) {
				if (user.comparePassword(req.body.currentpassword) || req.decoded.privilege >= 1) {

					if (req.body.password) user.password = req.body.password;
					if (req.body.name) user.name = req.body.name;
					if (req.body.privilege) user.privilege = req.body.privilege;

					user.save(function(err) {
						if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

						sentMessage = 'User (' + user.username + ') updated successfully.';
						res.json(new config.methods.serverResponse(sentMessage, req.params));
						console.log(sentMessage);
					});

				} else {
					sentMessage = 'Wrong or no password provided.';
					res.json(new config.methods.serverResponse(sentMessage, '', false));
					console.log(sentMessage);
				}
			} else {
				sentMessage = 'Could not find (' + req.params.username + ').';
				res.json(new config.methods.serverResponse(sentMessage, '', false));
				console.log(sentMessage);
			}
		});
	}
	
	function getSelf(req, res) {
		Users.findOne({
			username: req.decoded.username
		}, function(err, user) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			if (user) {
				sentMessage = 'User (' + user.username + ') found.';
				sentResponse = new config.methods.serverResponse(sentMessage, user);
			} else {
				sentMessage = 'Could not find user (' + req.params.username + ').';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
		});
	}

	function authUser(req, res) {

		Users.findOne({ username: req.body.username }).select('name username password privilege').exec(function(err, user) {
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			if (user) {
				if (user.comparePassword(req.body.password)) {
					
					var userinfo = {
						name: user.name,
						username: user.username,
						privilege: user.privilege
					};

					var newToken = jwt.sign(userinfo, config.db.secretKey, {
						expiresInMinutes: 1440
					});

					sentMessage = 'Authentication successful.';
					sentResponse = new config.methods.serverResponse(sentMessage, userinfo);
					sentResponse.token = newToken;

				} else {
					sentMessage = 'Wrong password provided.';
					sentResponse = new config.methods.serverResponse(sentMessage, '', false);
				}
			} else {
				sentMessage = 'Could not find user "' + req.body.username + '".';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
		});
	}
	
	function getUserPosts(req, res) {
		
		Users.findOne({ username: req.params.username })
		.select('posts')
		.populate('posts', '_id title body tags date')
		.exec(function(err, user) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
			
			if (user) {
				sentMessage = 'Returning posts from user.';
				sentResponse = new config.methods.serverResponse(sentMessage, user);
			}
			res.json(sentResponse);
			console.log(sentMessage);			
		});
	}
})();








