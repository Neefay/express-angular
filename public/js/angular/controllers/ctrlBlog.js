(function(){
	'use strict';

	angular.module('BlogMainController' , [])
		.controller('BlogMainCtrl', ['$http', '$timeout', 'UIService', '$routeParams', 'Auth', BlogMainCtrlFunction]);

	function BlogMainCtrlFunction($http, $timeout, UIService, $routeParams, Auth) {

		var vm = this;

		vm.postsData = {};
		vm.singlePost =

		vm.getPosts = getPosts;
		vm.getPost = getPost;
		vm.InitializeAll = InitializeAll;
		vm.InitializeSingle = InitializeSingle;
		vm.InitializeTags = InitializeTags;

		// =====================================================================================

		function InitializeSingle() {
			vm.getPost($routeParams.postId);
		}

		function InitializeTags() {
			vm.tagTitle = $routeParams.tagId;
			$http.get('/api/posts/tags/' + $routeParams.tagId)
			.success(function(data) {
				vm.postsData = data.data;
			});
		}

		function InitializeAll() {
			vm.getPosts().then(function(data) {
				vm.postsData = data.data.data;
				console.log(vm.postsData);
			});
		}

		function getPosts() {
			return $http.get('/api/posts')
			.success(function(data) { return data; });
		}

		function getPost(id) {
			$http.get('/api/posts/' + id)
			.success(function(data) {
				vm.singlePost = data.data;
				console.log(data);
			});
		}
	}
})();

