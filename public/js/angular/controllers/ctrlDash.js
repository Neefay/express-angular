(function(){
	'use strict';

	angular.module('DashboardMainController' , [])
		.controller('DashboardMainCtrl', ['$http', '$timeout', 'UIService', 'Auth', DashboardMainCtrlFunction]);

	function DashboardMainCtrlFunction($http, $timeout, UIService, Auth) {

		var vm = this;

		vm.state = '';
		vm.inputMode = 'new';
		vm.editingSelf = false;
		vm.formData = {userPrivilege: 0};
		vm.editFormData = {userPrivilege: 0};
		vm.postFormData = {};
		vm.postFormData.tags = [];
		vm.postFormData.tagInput = '';
		vm.allUsersTable = {};
		vm.allUsersTablePage = 1;
		vm.allUsersTableLimit = 4;
		vm.busy = false;

		vm.adminMenu = UIService.dashUI.adminDash;
		vm.userMenu = UIService.dashUI.userDash;

		vm.userAlert = {
			show: false,
			type: 'info',
			message: '',
			setState: function(a,b,c) { this.type = a; this.show = b; this.message = c; }
		};

		vm.setState = setState;
		vm.loadUserData = loadUserData;
		vm.getPrivilege = getPrivilege;
		vm.sendUser = sendUser;
		vm.getAllUsers = getAllUsers;
		vm.removeUser = removeUser;
		vm.editUser = editUser;
		vm.editSelf = editSelf;
		vm.sendPost = sendPost;
		vm.updateUser = updateUser;
		vm.validatePass = validatePass;
		vm.InitializeState = InitializeState;
		vm.addTag = addTag;
		vm.removeTag = removeTag;
		vm.getUserPosts = getUserPosts;
		vm.deletePost = deletePost;
		vm.setUserPage = setUserPage;
		vm.addUserPage = addUserPage;
		vm.getNumber = getNumber;

		vm.InitializeState();

		// ==========================================

		function InitializeState() {
			vm.setState('welcome');
		}

		function setState(state, arg) {
			if ((vm.state !== state)) {
				
				if ((state !== 'editUser')) { vm.editingSelf = false; }

				switch (state) {

					case 'welcome': {
						Auth.getSelf().success(function(data){
							loadUserData(data.username)
							.then(function(data){
								vm.selfData = data.data.data;
								vm.state = state;
							});
						});
					} break;

					case 'allUsers': {
						vm.getAllUsers(vm.allUsersTablePage)
						.then(function(data){
							vm.state = state;
						});
					} break;

					case 'updateSelf': {
						vm.editSelf();
						vm.editingSelf = true;
						vm.setState('editUser');
					} break;

					case 'userUpdate': {
						vm.editUser(arg, function() {
							vm.setState('editUser');
						});
					} break;

					case 'myPosts': {
						vm.getUserPosts(vm.selfData.username)
						.then(function(data){
							vm.selfData.posts = data.data.data.posts;
							vm.state = state;
						});
					} break;

					default: { vm.state = state; } break;
				}
			}

			vm.userAlert.setState('success', false, '');
		}		

		function setUserPage(page) {
			vm.allUsersTablePage = page;
			getAllUsers(vm.allUsersTablePage)
			.then(function(data){
				vm.allUsersTable = data.data;
			});			
		}

		function addUserPage(val) {
			switch (true) {

				case ((val === -1) && (vm.allUsersTablePage === 1)): {
					vm.setUserPage(vm.allUsersTablePagesTotal);
				} break;

				case ((val === 1) && (vm.allUsersTablePage === vm.allUsersTablePagesTotal)): {
					vm.setUserPage(1);
				} break;

				default: { vm.setUserPage(vm.allUsersTablePage + val); } break;
			}			
		}

		function editUser(user, callback) {
			if (user) {
				loadUserData(user)
				.then(function(data){
					vm.editFormData = data.data.data;
					return callback();
				});
			}
		}

		function editSelf() { vm.editFormData = vm.selfData; }

		function loadUserData(user) {
			return $http.get('/api/users/me').success(function(data) { return data; });
		}

		function getPrivilege(p) {
			switch (p) {
				case 0: { return 'User'; } break;
				case 1: { return 'Moderator'; } break;
				case 2: { return 'Administrator'; } break;
				default: { return 'User'; } break;
			}
		}

		function getAllUsers(limit, offset) {
			return $http.get('/api/users/' + (limit || 0))
			.success(function(data) { 
				vm.allUsersTable = data;
				vm.allUsersTablePagesTotal = (Math.ceil(vm.allUsersTable.userCount / vm.allUsersTableLimit));
				return data; 
			});
		}

		function getUserPosts(user) {
			return $http.get('/api/users/' + user + '/posts').success(function(data) { return data; });
		}

		function removeUser(user) {
			$http.delete('/api/users/' + user).success(function(data) {
				vm.userAlert.setState('warning', true, 'User removed successfully.');
				getAllUsers(vm.allUsersTablePage);
			});
		}

		function validatePass(callback) {
			if ((vm.formData.password1 !== vm.formData.password2)) {
				vm.userAlert.setState('danger', true, 'Please double-check your password.');
				vm.busy = false;
				return false;
			} else {
				return true;
			}
		}

		function updateUser(user) {
			var updateData = {};

			vm.busy = true;

			if (!(vm.validatePass())) { return false; }

			if (vm.editFormData.name) { updateData.name = vm.editFormData.name; }
			if (vm.editFormData.password1) { updateData.password = vm.editFormData.password1; }

			updateData.privilege = vm.editFormData.userPrivilege;
			updateData.currentpassword = (vm.editFormData.currentpassword || '');

			$http.put('/api/users/' + user, updateData)
			.success(function(data) {
				var msgState = 'danger';

				vm.busy = false;				

				if (data.success) {
					vm.editFormData.password1 = '';
					vm.editFormData.password2 = '';
					msgState = 'success';
					$timeout(function(){
						if (vm.editingSelf) {
							vm.setState('welcome');
						} else {
							vm.setState('allUsers');
						}
					}, 2000);										
				}
				
				vm.userAlert.setState(msgState, true, data.message);
			});
		}

		function sendUser() {

			vm.busy = true;

			if (!(vm.validatePass())) { return false; }

			$http.post('/api/users',
				{
					username: vm.formData.username,
					password: vm.formData.password2,
					name: (vm.formData.name || 'Anonymous User'),
					privilege: (vm.formData.userPrivilege || 0)
				}
			).success(function(data) {
				vm.formData = {userPrivilege: 0};
				vm.userAlert.setState('success', true, data.message);
				vm.busy = false;
			});
		}
		
		function sendPost() {
			vm.busy = true;
			
			$http.post('/api/posts',
		 		{
					title: vm.postFormData.title,
					body: vm.postFormData.body,
			  		tags: vm.postFormData.tags
				}
			).success(function(data) {
				vm.busy = false;
				vm.postFormData = {};

				vm.userAlert.setState('success', true, data.message);
			});
		}

		function addTag() {
			if ((vm.postFormData.tags.indexOf(vm.postFormData.tagInput) < 0) && (vm.postFormData.tagInput.length > 0)) {
				vm.postFormData.tags.push(vm.postFormData.tagInput);				
			}
			vm.postFormData.tagInput = '';
		}

		function removeTag(tag) {
			vm.postFormData.tags.splice(vm.postFormData.tags.indexOf(tag), 1);
		}

		function deletePost(post) {
			$http.delete('/api/posts/' + post).success(function(data){
				vm.userAlert.setState('success', true, data.message);
				vm.getUserPosts(vm.selfData.username)
				.then(function(data){
					vm.selfData.posts = data.data.data.posts;					
				});
			});
		}

		function getNumber(n) { return new Array(n); }
	}
})();
