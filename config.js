
// SERVER CONFIGS

module.exports = {
	env: 'development',
	port: process.env.PORT || 8080,

	folders: {
		views: 'views',
		static: 'static',
		partials: 'partials'
	},

	db: {
		path: 'mongodb://localhost/',
		secretKey: 'ClearAsACrispSpringMorning'
	},

	queries: {
		limit: 4
	},

	methods: {
		serverResponse:
			function(message, data, success) {
				this.header = 'Server response.';
				this.message = message || 'No message specified.';
				this.success = (success === undefined) ? true : success;
				this.data = data || '';
			}
	}
};