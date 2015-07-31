(function(){
	'use strict';

	angular.module('AppMainController' , [])
		.controller('AppMainCtrl', AppMainCtrlFunction);

	function AppMainCtrlFunction($rootScope, $timeout, $location, Auth) {

		var vm = this;

		vm.formData = {};
		vm.waitingData = false;
		vm.loggedIn = false;
		vm.viewChanging = false;

		vm.loginAlert = {
			show: false,
			type: 'default',
			message: '',
			setState: function(a,b,c) { this.type = a; this.show = b; this.message = c; }
		};

		Auth.getSelf().success(function(data){ vm.userData = data.data; });
		
		vm.loginUser = loginUser;
		vm.endSession = endSession;
		
		$rootScope.$on('$routeChangeStart', function() {
			vm.loggedIn = Auth.isLoggedIn();
			if (($location.path() == '/login') && (vm.loggedIn)) { $location.path('/dashboard'); }
		});
		
		function endSession() {
			vm.loggedIn = false;

			Auth.logOut();

			vm.userData = {};
			vm.formData = {};

			vm.loginAlert.setState('success', false, '');

			$location.path('/login');
		}

		function loginUser() {
			if (!vm.waitingData) {
				vm.waitingData = true;
				vm.loginAlert.show = false;

				Auth.login(vm.formData.username, vm.formData.password)
				.then( function(data) {
					vm.waitingData = false;

					if (data.data.success) {

						vm.loginAlert.setState('success', true, data.data.message);

						vm.userData = data.data.data;

						$timeout(function(){
							$location.path('/dashboard');
						}, 2000);
					} else {
						vm.loginAlert.setState('danger', true, data.data.message);
					}
				});
			}
		}
	}
})();
