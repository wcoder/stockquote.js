steal(
	'jquery/controller',
	'jquery/view/ejs',
function ($) {
	
	$.Controller('Finance.Search', {
		init: function () {},
		submit: function () {

			var searchQuery = this.element.children('#search-company').val().toUpperCase().replace(/\s+/g, '');

			if (searchQuery) {
				location.hash = '#!q=' + searchQuery;
			} else {
				Notification.show({
					message: 'Enter the name of the company! For example: AAPL',
					type: 'warning'
				});
			}
			return false;
		}
	});

});