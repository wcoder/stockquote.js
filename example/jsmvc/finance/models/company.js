steal(
	'jquery',
	'jquery/model'
).then(
	'../plugins/stockquote/jquery.stockquote.js',
function () {

	$.Model('Finance.Models.Company', {
		
		findAll: function (service, companies, callback) {

			try {

				$.stockQuote({
					service: service,
					company: companies,
					callback: callback
				});

				return true;
			} catch (e) {
				console.log("Service '" + service + "' not supported! [" + e + "]");
			}
		},
		findOne: function (service, company, callback) {

			try {

				$.stockQuote({
					service: service,
					company: [company],
					callback: callback
				});

				return true;
			} catch (e) {
				console.log("Service '" + service + "' not supported! [" + e + "]");
			}
		}

	}, {});
});