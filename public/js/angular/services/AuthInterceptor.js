(function(){
	'use strict';

	angular.module('AuthInterceptorMainFactory', [])

	.factory('AuthInterceptor', function($q, $location, AuthToken) {

			var AuthInterceptorFactory = {};
			
			AuthInterceptorFactory.request = request;
			AuthInterceptorFactory.responseError = responseError;
			
			return AuthInterceptorFactory;
			
			function request(config) {
				
				var token = AuthToken.getToken();
				
				if (token)
					config.headers['x-access-session-token'] = token;
				
				return config;
			}
			
			function responseError(response) {
				
				if (response.status === 403) {
					AuthToken.setToken();
					$location.path('/login');
				}
				
				if (response.status === 404) {
					$location.path('/');
				}				
				
				return $q.reject(response);
			}
		});
})();