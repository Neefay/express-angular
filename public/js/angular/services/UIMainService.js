(function(){
	'use strict';

	angular.module('UIMainService', [])

	.service('UIService', function() {

		this.navUI = {
			
			genericNav: [
				{
					desc: 'Blog',
					link: '/blog'
				},				
				{
					desc: 'Contact',
					link: '/contact'
				},
				{
					desc: 'About',
					link: '/about'
				}
			],
			userNav: [
				{
					desc: 'Dashboard',
					link: '/dashboard'
				},
				{
					desc: 'Quotes',
					link: '/quotes'
				}					
			],
			anonNav: [
				{
					desc: 'Login',
					link: '/login'
				}
			]
		};

		this.dashUI = {
			
			adminDash: [
				{
					desc: 'New user',
					link: 'newUser',
					icon: 'plus'
				},
				{
					desc: 'All users',
					link: 'allUsers',
					icon: 'user'
				}
			],
			
			userDash: [
				{
					desc: 'Home',
					link: 'welcome',
					icon: 'home'
				},
				{
					desc: 'New Post',
					link: 'newPost',
					icon: 'plus'
				},
				{
					desc: 'My posts',
					link: 'myPosts',
					icon: 'book'
				}				
			]
		};
	});
})();