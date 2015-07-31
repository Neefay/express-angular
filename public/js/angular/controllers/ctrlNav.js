(function(){
	'use strict';

	angular.module('NavMainController', [])
		.controller('NavCtrl', ['$location', '$scope', 'UIService', function($location, $scope, UIService) {

			var vm = this;

			vm.menu = UIService.navUI.genericNav;
			vm.userMenu = UIService.navUI.userNav;
			vm.anonMenu = UIService.navUI.anonNav;

			vm.isActive = function(e) { return e === $location.path(); };
		}]);
})();