(function(){
	'use strict';

	// SERVER DEPENDENCIES

	var 	express = require('express'),
			mongoose = require('mongoose'),

			bodyParser = require('body-parser'),
			methodOverride = require('method-override'),
			http = require('http'),
			path = require('path'),
			morgan = require('morgan'),
			favicon = require('serve-favicon'),

			config = require('./config.js'),
			routes = require('./routes/routes.js'),
			api = require('./routes/api.js');

	var app = module.exports = express();

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	// CONNECTS TO MONGODB USING MONGOOSE

	mongoose.connect(config.db.path, function(err) {
		if (err) throw	console.log('Error connecting to database: ', err);

		console.log('Connected successfully to database.');
	});

	// ENVIRONMENTS

	app.set('port', process.env.PORT || config.port);
	app.set('views', __dirname + '/' + config.folders.views);
	app.set('view engine', 'ejs');

	app.use(morgan('dev'));

	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/bower_components',  express.static(__dirname + '/bower_components'));
	app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

	var env = process.env.NODE_ENV || config.env;

	// SERVES ROUTES

	app.get('/', routes.index);
	app.get('/' + config.folders.partials + '/:view', routes.views);

	// API ROUTES

	var 	quotesApiRouter = express.Router(),
			usersApiRouter = express.Router(),
			postsApiRouter = express.Router(),
			dashboardRouter = express.Router();

	quotesApiRouter
		.get('/', api.quotes.getQuotes)
		.use(api.methods.authenticateToken)		
		.post('/', api.quotes.addQuote)
		.delete('/:id', api.quotes.removeQuote);

	usersApiRouter
		.post('/', api.users.addUser)
		.post('/auth', api.users.authUser)
		.use(api.methods.authenticateToken)
		.get('/me', api.users.getSelf)
		.get('/:page', api.users.getUsers)
		.get('/:username', api.users.getUser)
		.put('/:username', api.users.putUser)
		.delete('/:username', api.users.removeUser)
		.get('/:username/posts', api.users.getUserPosts);

	postsApiRouter
		.get('/', api.posts.getPosts)
		.get('/:postId', api.posts.getPost)
		.get('/tags/:tagId', api.posts.getTag)
		.use(api.methods.authenticateToken)
		.post('/', api.posts.addPost)
		.delete('/:postId', api.posts.removePost)
		.put('/:postId', api.posts.putPost);

	// MOUNT API ROUTES

	app.use('/api/quotes', quotesApiRouter);
	app.use('/api/users', usersApiRouter);
	app.use('/api/posts', postsApiRouter);
	app.use('/dashboard', dashboardRouter);

	// FALLBACK

	app.get('*', routes.index);

	// CLOSES CONNECTION WITH DB WHEN TERMINATED

	process.on('SIGINT', function() {
	  mongoose.connection.close(function () {
		 console.log('Mongoose default connection disconnected through app termination.');
		 process.exit(0);
	  });
	});

	// STARTS SERVER

	http.createServer(app).listen(app.get('port'), function () {
	  console.log('Express server listening on port ' + app.get('port'));
	});

})();