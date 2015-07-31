(function(){
	'use strict';

	var 	express = require('express'),
			mongoose = require('mongoose'),

			config = require('../../config.js');

	// REQUIRE ALL MODELS

	var Posts = require('../../db/models/modelPosts.js');
	var Users = require('../../db/models/modelUsers.js');

	// INITIALIZE RESPONSE VARIABLES

	var sentMessage, sentResponse;

	exports.getPosts = getPosts;
	exports.addPost = addPost;
	exports.getPost = getPost;
	exports.removePost = removePost;
	exports.putPost = putPost;
	exports.getTag = getTag;

	// =====================================================================================

	function getPosts(req, res) {

		Posts.find({}).populate('_author', 'name privilege posts join_date').exec(function(err, posts) {

			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			if (posts.length > 0) {
				sentMessage = 'Returning all posts.';
				sentResponse = new config.methods.serverResponse(sentMessage, posts);
			} else {
				sentMessage = 'No posts made so far.';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);

		});
	}	
	
	function getPost(req, res) {

		Posts.findOne({ _id: req.params.postId }).populate('_author', '_id name privilege').exec(function(err, post) {

			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			if (post) {
				sentMessage = 'Returning the post.';
				sentResponse = new config.methods.serverResponse(sentMessage, post);
			} else {
				sentMessage = 'Invalid post.';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
		});
	}	

	function getTag(req, res) {

		Posts.find({ tags: req.params.tagId }).populate('_author', '_id name privilege').exec(function(err, posts) {

			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

			if (posts.length > 0) {
				sentMessage = 'Returning all posts with tag.';
				sentResponse = new config.methods.serverResponse(sentMessage, posts);
			} else {
				sentMessage = 'No posts made so far.';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
		});		
	}
	
	function addPost(req, res) {

		Users.findOne({ username: req.decoded.username }).select('_id name posts').exec(function(err, user) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
			
			if (user) {
				console.log(user);
				
				var post = new Posts({
					title: req.body.title || 'No title',
					body: req.body.body || 'No body',
					_author: user._id,
					tags: req.body.tags || ''
				});				
				
				post.save(function (err, post) {
					
					if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
					
					user.posts.push(post._id);
					
					user.save(function(err) {
						if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

						sentMessage = 'Post (' + post.title + ') saved successfully.';
						sentResponse = new config.methods.serverResponse(sentMessage, post);

						res.json(sentResponse);
						console.log(sentMessage);					
					});
				});
			}
		});
	}
	
	function removePost(req, res) {

		Posts.findOneAndRemove({
			_id: req.params.postId
		}, function(err, post) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
		
			if (post) {
				sentMessage = 'Post (' + post.title + ') removed.';
				sentResponse = new config.methods.serverResponse(sentMessage, post);
			} else {
				sentMessage = 'This post doesn\'t exist.';
				sentResponse = new config.methods.serverResponse(sentMessage, '', false);
			}
			res.json(sentResponse);
			console.log(sentMessage);
			
		});
	}	
	
	function putPost(req, res) {
	
		Posts.findOne({ _id: req.params.postId })
		.select('title body tags rating')
		.populate('_author', 'username')
		.exec(function(err, post) {
			
			if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));
			
			if (post) {
				if ((req.decoded.privilege >= 1) || (post._author.username === req.decoded.username)) {

					if (req.body.title) post.title = req.body.title;
					if (req.body.body) post.title = req.body.body;
					if (req.body.tags) post.title = req.body.tags;
					if (req.body.rating) post.title = req.body.rating;

					post.save(function(err) {
						if (err) return res.json(new config.methods.serverResponse(err.message, err.message, false));

						sentMessage = 'Post updated successfully.';
						res.json(new config.methods.serverResponse(sentMessage, post));
						console.log(sentMessage);
					});

				} else {
					sentMessage = 'You have insufficient permissions to edit this post.';
					res.json(new config.methods.serverResponse(sentMessage, '', false));
					console.log(sentMessage);
				}
			} else {
				sentMessage = 'This post doesn\'t exist.';
				res.json(new config.methods.serverResponse(sentMessage, '', false));
				console.log(sentMessage);
			}
		});
	}	

})();
