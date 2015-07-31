(function(){
	'use strict';

	angular.module('resizeDirectiveModule' , [])
	.directive('pushBottom', function() {
		return function link(scope, element) {
			
			var parent = element.parent();
			scope.$watch(function () { return $(element).height(); }, function (newValue, oldValue) {
			
				if (newValue > 0) {
					parent.css('height', newValue + 'px');
				}
			});
		};
	});
})();