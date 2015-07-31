(function(){
	'use strict';

	var exangularApp = angular.module('exangularApp', [
		'ngRoute',
		'ngAnimate',
		'ui.bootstrap',

		'exangularRoutes',
		
		'exangularServices',
		'exangularControllers',
		'exangularDirectives'
	]);
})();