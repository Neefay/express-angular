(function(){
	'use strict';

	angular.module('exangularRoutes' , [])
	.config(['$routeProvider', '$httpProvider', '$locationProvider', function($routeProvider, $httpProvider, $locationProvider) {
		$routeProvider

		.when('/', {
			redirectTo: '/login'
		})
		.when('/dashboard', {
			templateUrl: '/partials/dashboard',
			controller: 'DashboardMainCtrl',
			controllerAs: 'dash'
		})
		.when('/quotes', {
		  templateUrl: '/partials/quotes',
		  controller: 'QuotesCtrl',
		  controllerAs: 'index'
		})
		.when('/contact', {
		  templateUrl: '/partials/contact'
		})
		.when('/about', {
		  templateUrl: '/partials/about'
		})
		.when('/login', {
			templateUrl: '/partials/login',
			controller: 'AppMainCtrl'
		})
		.when('/blog', {
			templateUrl: '/partials/allPosts',
			controller: 'BlogMainCtrl',
			controllerAs: 'blog'
		})
		.when('/blog/tags/:tagId', {
			templateUrl: '/partials/allTagPosts',
			controller: 'BlogMainCtrl',
			controllerAs: 'tags'
		})		
		.when('/blog/:postId', {
			templateUrl: '/partials/singlePost',
			controller: 'BlogMainCtrl',
			controllerAs: 'post'
		})
		.otherwise({
		  redirectTo: '/'
		});

		$locationProvider.html5Mode({ enabled: true, requireBase: true });
		
		$httpProvider.interceptors.push('AuthInterceptor');
	}]);
})();