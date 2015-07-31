(function(){
	'use strict';

	module.exports = function (grunt) {
		require('load-grunt-tasks')(grunt);

		var config = {
			public: 'public',
			views: 'views',			
			port: '8080'
		};

		grunt.initConfig({

			pkg: grunt.file.readJSON('package.json'),

			express: {
				options: {
					port: config.port
				},
				web: {
					options: {
						script: 'app.js'
					}
				}
			},

			watch: {
				gruntfile: {
					files:['Gruntfile.js'],
					tasks: ['jshint']
				},

				ejs: {
					files: [ config.views + '/**/*.ejs'	]					
				},

				js: {
					files: [ config.public + '/js/**/*.js', 'routes/**/*.js', 'app.js' ],
					tasks: ['jshint']
				},

				css: {
					files: [ config.public + '/styles/*.css', ]
				},				

				server: {
					files: [ 
						'app.js',
						'config.js',
						'routes/**/*.js'
					],
					tasks: [ 'express:web' ],
					options: {
						nospawn: true,
						atBegin: true
					}
				},

				livereload: {
					files: [
						config.views + '/**/*.ejs',
						config.public + '/js/**/*.js', 
						config.public + '/styles/*.css'
					],
					options: { livereload: true }
				}
			},

			jshint: {
				all: [ config.public + '/js/**/*.js', 'routes/**/*.js', 'app.js', 'Gruntfile.js' ],
				options: { node: true }
			},

			parallel: {
				web: {
					options: { stream: true	},
					tasks: [						
						{ grunt: true, args: ['watch:ejs'] },
						{ grunt: true, args: ['watch:css'] },
						{ grunt: true, args: ['watch:gruntfile'] },
						{ grunt: true, args: ['watch:js'] },
						{ grunt: true, args: ['watch:server'] },
						{ grunt: true, args: ['watch:livereload']}
					]
				}
			}			
		});

		grunt.registerTask('default', ['parallel:web']);
	};

})();
