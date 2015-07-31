(function(){
	'use strict';

	angular.module('QuotesMainController' , [])
		.controller('QuotesCtrl', ['$http', '$location', QuotesCtrlFunction]);

	function QuotesCtrlFunction($http, $location) {
		
		var  vm = this;

		vm.form = {};
		vm.quotesList = [];
		vm.busy = false;
		
		vm.submitQuote = submitQuote;
		vm.removeQuote = removeQuote;
		vm.removeAllQuotes = removeAllQuotes;
		vm.getQuotes = getQuotes;
		
		vm.getQuotes();

		function submitQuote() {
			if (!vm.busy) {
				vm.busy = true;
				
				$http.post('/api/quotes', vm.form)
				.success(function() {
					vm.getQuotes();
					vm.form = {};
					vm.busy = false;
				});	
			}
		}

		function removeQuote(id) {
			$http.delete('/api/quotes/' + id)
			.success(function(data) {
				vm.getQuotes();
			});
		}

		function removeAllQuotes() {
			$http.delete('/api/quotes/all').
			success(function(data) {
				vm.getQuotes();
			});
		}

		function getQuotes() {
			$http.get('/api/quotes')
			.success(function(data) {
				console.log(data);
				vm.quotesList = data;
			});
		}
	}
})();