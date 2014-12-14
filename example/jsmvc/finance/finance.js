steal(
	'./finance.css',
	'./models/models.js',
	'finance/company/list',
	'finance/company/one',
	'finance/search',
	'finance/navigator',

	'./plugins/notification/notification.css',
	'./plugins/notification/jquery.notification.js',
function () {

	// Search information about the company
	$('#search form').finance_search();

	// Using Hash Controller for navigation
	$('#wrap').finance_navigator();

});