(function(){
	'use strict';

	angular.module('AuthMainFactory', [])

	.factory('Auth', function($http, $q, $location, AuthToken) {

		var AuthFactory = {};

		AuthFactory.login = login;
		AuthFactory.logOut = logOut;
		AuthFactory.isLoggedIn = isLoggedIn;
		AuthFactory.getSelf = getSelf;

		return AuthFactory;

		function login(user, pass) {
			return $http.post('/api/users/auth', {
				username: user,
				password: pass
			})
			.success(function(data) {
				AuthToken.setToken(data.token);
				return data;
			});
		}

		function getSelf() {
			return $http.get('/api/users/me');
		}

		function logOut() { AuthToken.setToken(); $location.path('/login'); }

		function isLoggedIn() {	
			var hasToken = AuthToken.getToken();
			
			return (hasToken) ? true : false;
		}

	});
})();