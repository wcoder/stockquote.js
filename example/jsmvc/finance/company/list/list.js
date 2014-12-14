steal(
	'jquery/controller',
	'jquery/view/ejs',
function ($) {

	"use strict"

	$.Controller('Finance.Company.List', {
		defaults: {
			service: '',
			companies: []
		}
	},
	{
		init: function () {

			var _this = this;

			Finance.Models.Company.findAll(
				this.options.service,
				this.options.companies,
				function (data) {
					if (!data) {
						_this.element.html("Companies list is not received!");
					} else {
						_this.element.html($.View('//finance/company/list/views/company_list.ejs', data));
					}
				}
			);
		}
	});

});