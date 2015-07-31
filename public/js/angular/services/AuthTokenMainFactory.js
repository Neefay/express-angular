(function(){
	'use strict';

	angular.module('AuthTokenMainFactory', [])

	.factory('AuthToken', function($window) {

		var AuthTokenFactory = {};
		
		AuthTokenFactory.getToken = getToken;
		AuthTokenFactory.setToken = setToken;

		return AuthTokenFactory;
		
		function getToken() {
			return $window.localStorage.getItem('session-token');
		}
		
		function setToken(token) {
			if (token) {
				$window.localStorage.setItem('session-token', token);
			} else {
				$window.localStorage.removeItem('session-token');
			}
		}
	});
})();