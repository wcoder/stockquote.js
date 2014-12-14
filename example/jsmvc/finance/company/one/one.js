steal(
	'jquery/controller',
	'jquery/view/ejs',
function ($) {

	$.Controller('Finance.Company.One', {
		defaults: {
			service: '',
			company: ''
		}
	},
	{
		init: function () {
			this.getInformation();
		},
		getInformation: function () {
			
			var _this = this;

			Finance.Models.Company.findOne(
				this.options.service,
				this.options.company,
				function (data) {
					if (!data) {
						_this.element.html("The campaign is not found!");
					} else {
						_this.element.html($.View('//finance/company/one/views/company.ejs', data));
					}
				}
			);
		}
	});

});