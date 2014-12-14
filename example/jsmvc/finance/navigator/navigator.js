steal(
	'jquery/controller',
	'jquery/event/hashchange',

	'../plugins/tablesorter/tablesorter.css'
).then(
	'../plugins/tablesorter/jquery.tablesorter.js',
function ($) {
	
	$.Controller('Finance.Navigator', {
		init: function () {
			this.updateContent();
		},
		'{window} hashchange': function () {
			this.updateContent();
		},
		updateContent: function () {
			// Get рash parameters
			var hash = window.location.hash.substr(2);
			var hashVal = hash.split('=');

			// Search parameter
			if (hashVal[0] !== 'q') {
				// Displays a list companies
				this.homePage();
			} else {
				// Output search result
				if (hashVal[1]) {				   
					this.searchPage(hashVal[1]);				
				} else {
					location.href = '';
				}
			}
		},
		homePage: function () {
			$('#search-result-financecontent').addClass('hideBlock');
			$('#search-result-google').addClass('hideBlock');
			$('#search-result-microsoft').addClass('hideBlock');
			$('#search h4').addClass('hideBlock');

			$('#quotes').removeClass('hideBlock');

			// Query the list of companies from a file companies.xml
			$.ajax({
				url: 'companies.xml',
				dataType: "xml",
				error: function (e) {
					Notification.show({
						message: 'List companies for display not loaded! [' + e.statusText + ']',
						type: 'error'
					});
				},
				success: function (responseXML) {
					var companyList = []; 

					// Get the list of companies
					$(responseXML).find("company").each(function () {
						companyList.push($(this).text());
					});

					// Writing list company
					$('#quotes-financecontent').finance_company_list({
						service: 'FinanceContent',
						companies: companyList
					});
					$('#quotes-google').finance_company_list({ 
						service: 'Google',
						companies: companyList
					});
					$('#quotes-microsoft').finance_company_list({
						service: 'Microsoft',
						companies: companyList
					});

					// Using jQuery plugin - TableSorter
					setTimeout(function () {
						$('#quotes-financecontent').tablesorter({
							sortList: [[4, 1]]
						});
						$('#quotes-google').tablesorter({
							sortList: [[4, 1]]
						});
						$('#quotes-microsoft').tablesorter({
							sortList: [[4, 1]]
						});
					}, 5000);
				}
			});
		},
		searchPage: function (hashValue) {
			$('#search-result-financecontent').remove();
			$('#search-result-google').remove();
			$('#search-result-microsoft').remove();
			$('#search h4').remove();

			$('#search').append('<h4>FinanceContent.com</h4><section id="search-result-financecontent">Loading...</section>');
			$('#search').append('<h4>Google Finance</h4><section id="search-result-google">Loading...</section>');
			$('#search').append('<h4>Microsoft Finance</h4><section id="search-result-microsoft">Loading...</section>');

			$('#quotes').addClass('hideBlock');
			$('#search h4').removeClass();
					
			// Writing company
			$('#search-result-financecontent').finance_company_one({
				service: 'FinanceContent',
				company: hashValue
			});
			$('#search-result-google').finance_company_one({
				service: 'Google',
				company: hashValue
			});
			$('#search-result-microsoft').finance_company_one({
				service: 'Microsoft',
				company: hashValue
			});
		}
	});
});
