(function(){
	'use strict';

	/* SERVICES */

	angular.module('exangularServices', 
		[
			'UIMainService',
			'AuthMainFactory',
			'AuthTokenMainFactory',
			'AuthInterceptorMainFactory'
		]);
})();