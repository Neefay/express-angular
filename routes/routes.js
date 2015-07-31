
// ROUTES

var config = require('../config.js');

exports.index = function(req, res) {
	res.render(config.folders.static + '/' + 'index');
};

exports.static = function(req, res) {
	res.render(config.folders.static + req.params.static);
};

exports.views = function(req, res) {
	res.render(config.folders.partials + '/' + req.params.view);
};
