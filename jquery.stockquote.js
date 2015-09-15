/**
 * @name stockquote (Stock Quote)
 * @description The utility for receiving stock quotations of the companies, according to different services
 * @author evgeniy.pakalo@gmail.com (Yauheni Pakala)
 * @version 0.1.0 2012
 */
(function ($) {

	/**
	 * Function for output error
	 * @type {function}
	 */
	var error = function (message) {
		if (!message) {
			message = "Error, data not received!";
		}
		window.console.log("Error: " + message);
	};


	/**
	 * Class parent of all models
	 * @type {object}
	 * @enum {object}
	 */
	var Models = {
		service: {},
		google: {},
		microsoft: {},
		financecontent: {}
	};


	/**
	 * Model describing object of a class of services (Class parent)
	 * @this Models
	 */
	Models.service = function () {

		this.init = function () {
			return false;
		};

		this.getAll = function () {
			return false;
		};

		this.getOne = function () {
			return false;
		};

		this.changeData = function (data) {
			return false;
		};

		this.date = function (date) {
			return date;
		};

		this.ajax = function (settings) {
			$.ajax({
				url: settings.url,
				dataType: 'jsonp',
				error: settings.error,
				success: settings.success
			});
		};

		this.getLogo = function (ticker, exchange) {
			switch (exchange) {
			case "NASDAQ":
				return "http://www.nasdaq.com/logos/" + ticker + ".GIF";
			case "NYSE":
				return "http://www.nyse.com/images/listed/log-" + ticker.toLowerCase() + ".gif";
			default:
				return "http://dummyimage.com/150x80/ffffff/CCCCCC.gif&text=Logo+not+found!";
			}
		};
	};


	/**
	 * Class for work with service FinanceContent.com
	 * @this Models
	 * @extends Models.service
	 * @param {object} options
	 */
	Models.financecontent = function (options) {

		/**
		 * We inherit model - service
		 */
		this.parent = new Models.service();

		/**
		 * Definition of a used method
		 * @constructor
		 */
		this.init = function () {
			if (options.company.length > 1) {
				this.getAll();
			} else {
				this.getOne();
			}
		};

		/**
		 * Request of data on several companies
		 */
		this.getAll = function () {
			var _this = this;

			// global function for processing
			window.updateQuotes = function (responseObject) {
				var companyName;

				for (companyName in responseObject) {
					if (responseObject.hasOwnProperty(companyName)) {
						responseObject[companyName] = _this.changeData(responseObject[companyName]);
					}
				}
				options.callback(responseObject);
			};

			// request data
			this.ajax(options.company.join("+"));
		};

		/**
		 * Request of data on one company
		 */
		this.getOne = function () {
			var _this = this;

			// global function for processing
			window.updateQuotes = function (responseObject) {
				if (responseObject[options.company] !== undefined) {
					options.callback(_this.changeData(responseObject[options.company]));
				} else {
					error();
					options.callback(false);
				}
			};

			// request data
			this.ajax(options.company, options.callback);
		};

		/**
		 * Method for transformation of data to the necessary format
		 * @param {object} object, receiving from service
		 * @return {object} object in the format necessary to us
		 */
		this.changeData = function (data) {
			if (data.Open === 0) {
				data.Open = "-";
			}
			if (data.Open === "-") {
				data.Range = "-";
			} else {
				data.Range = data.Low + " - " + data.High;
			}

			data.Change = window.parseFloat(data.Change.toFixed(2));
			data.ChangePercent = window.parseFloat(data.ChangePercent.toFixed(2));
			data.ExchangeShortName = data.ExchangeShortName.toUpperCase();
			data.Img = this.getLogo(data.Ticker, data.ExchangeShortName);
			data.TradeTime = this.date(data.TradeTime);

			return data;
		};

		/**
		 * Method for date transformation
		 * @param {string|number} date, receiving from service
		 * @return {number} date in the Unix time format
		 */
		this.date = function (date) {
			return this.parent.date(date);
		};

		/**
		 * Method for receiving a logo (a method of the parent)
		 * @param {string} short name of the company
		 * @param {string} short name of the exchange
		 * @return {string} path to the company image
		 */
		this.getLogo = function (ticker, exchange) {
			return this.parent.getLogo(ticker, exchange);
		};

		/**
		 * Method for request of data from the server
		 */
		this.ajax = function (companyString, success) {
			window.quote = null;

			// use for this purpose jQuery-function
			this.parent.ajax({
				url: "http://client.financialcontent.com/demo/JSQuote?Ticker=" + companyString,
				error: function (e) {
					if (window.quote === undefined) {
						error();
						options.callback(false);
					} else {
						var property,
							count = 0;
						for (property in window.quote) {
							count++;
						}

						if (count === 0) {
							error();
							options.callback(false);
						}
					}
				},
				success: success
			});
		};

		/**
		 * We start the constructor
		 */
		this.init();
	};


	/**
	 * Class for work with service Google Finance
	 * @this Models
	 * @extends Models.service
	 * @param {object} options
	 */
	Models.google = function (options) {

		/**
		 * We inherit model - service
		 */
		this.parent = new Models.service();

		/**
		 * Definition of a used method
		 * @constructor
		 */
		this.init = function () {
			if (options.company.length > 1) {
				this.getAll();
			} else {
				this.getOne();
			}
		};

		/**
		 * Request of data on several companies
		 */
		this.getAll = function () {
			var _this = this;

			// request data
			this.ajax(options.company.join(","), function (responseObject) {
				var companyName,
					companyObjectNew = {};

				for (companyName in responseObject) {
					if (responseObject.hasOwnProperty(companyName)) {
						companyObjectNew[responseObject[companyName].t] = _this.changeData(responseObject[companyName]);
					}
				}
				options.callback(companyObjectNew);
			});
		};

		/**
		 * Request of data on one company
		 */
		this.getOne = function () {
			var _this = this;

			// request data
			this.ajax(options.company, function (responseObject) {
				options.callback(_this.changeData(responseObject[0]));
			});
		};

		/**
		 * Method for transformation of data to the necessary format
		 * @param {object} object, receiving from service
		 * @return {object} object in the format necessary to us
		 */
		this.changeData = function (data) {
			var companyObjectNew = {
				Ticker: data.t,
				Name: data.t,
				Last: window.parseFloat(data.l),
				Change: window.parseFloat(data.c.replace(/\+/, "")),
				ChangePercent: window.parseFloat(data.cp.replace(/\+/, "")),
				TradeTime: this.date(data.lt),
				ExchangeShortName: data.e,
				Img: this.getLogo(data.t, data.e),

				Open: "-",
				Bid: "-",
				Range: "-"
			};

			if (data.el !== undefined) {
				companyObjectNew.Bid = window.parseFloat(data.el);
			}

			return companyObjectNew;
		};

		/**
		 * Method for date transformation
		 * @param {string|number} date, receiving from service
		 * @return {number} date in the Unix time format
		 */
		this.date = function (date) {
			var currentYear = (new Date()).getYear() + 1900,
				parseDate = date.replace(/(\w+)\s(\d+),\s(\d+:\d+)(\w+)\s(\w+)/, "$2 $1 " + currentYear + ", $3 $4 $5");

			return this.parent.date(Date.parse(parseDate) / 1000);
		};

		/**
		 * Method for receiving a logo (a method of the parent)
		 * @param {string} short name of the company
		 * @param {string} short name of the exchange
		 * @return {string} path to the company image
		 */
		this.getLogo = function (ticker, exchange) {
			return this.parent.getLogo(ticker, exchange);
		};

		/**
		 * Method for request of data from the server
		 */
		this.ajax = function (companyString, success) {

			// use for this purpose jQuery-function
			this.parent.ajax({
				url: "http://finance.google.com/finance/info?client=ig&q=" + companyString,
				error: function (e) {
					error();
					options.callback(false);
				},
				success: success
			});
		};

		/**
		 * We start the constructor
		 */
		this.init();
	};


	/**
	 * Class for work with service Microsoft Finance
	 * @this Models
	 * @extends Models.service
	 * @param {object} options
	 */
	Models.microsoft = function (options) {

		/**
		 * We inherit model - service
		 */
		this.parent = new Models.service();

		/**
		 * Definition of a used method
		 * @constructor
		 */
		this.init = function () {
			if (options.company.length > 1) {
				this.getAll();
			} else {
				this.getOne();
			}
		};

		/**
		 * Request of data on several companies
		 */
		this.getAll = function () {
			var _this = this;

			// request data
			this.ajax(options.company.join(","), function (responseObject) {
				var companyObjectNew = {}, companyName;

				for (companyName in responseObject) {
					if (responseObject.hasOwnProperty(companyName)) {
						companyObjectNew[responseObject[companyName].Symbol] = _this.changeData(responseObject[companyName]);
					}
				}
				options.callback(companyObjectNew);
			});
		};

		/**
		 * Request of data on one company
		 */
		this.getOne = function () {
			var _this = this;

			// request data
			this.ajax(options.company, function (responseObject) {
				options.callback(_this.changeData(responseObject[0]));
			});
		};

		/**
		 * Method for transformation of data to the necessary format
		 * @param {object} object, receiving from service
		 * @return {object} object in the format necessary to us
		 */
		this.changeData = function (data) {
			if (data.Symbol !== undefined) {
				var companyObjectNew = {
					Ticker: data.Symbol,
					Name: data.CompanyName,
					Last: window.parseFloat(data.Last.toFixed(2)),
					Change: window.parseFloat(data.Change.toFixed(2)),
					ChangePercent: window.parseFloat(data.PercentChange.toFixed(2)),
					TradeTime: this.date(data.TimeOfLastSale),

					Img: this.getLogo("-", "-"),
					ExchangeShortName: "-",
					Open: "-",
					Bid: "-",
					Range: "-"
				};

				if (data.RTLast !== undefined) {
					companyObjectNew.Bid = data.RTLast;
				}

				return companyObjectNew;
			} else {
				error();
				return false;
			}
		};

		/**
		 * Method for date transformation
		 * @param {string|number} date, receiving from service
		 * @return {number} date in the Unix time format
		 */
		this.date = function (date) {
			return this.parent.date(window.parseInt(date.replace(/\/Date\((\d+)\)\//, "$1")) / 1000);
		};

		/**
		 * Method for receiving a logo (a method of the parent)
		 * @param {string} short name of the company
		 * @param {string} short name of the exchange
		 * @return {string} path to the company image
		 */
		this.getLogo = function (ticker, exchange) {
			return this.parent.getLogo(ticker, exchange);
		};

		/**
		 * Method for request of data from the server
		 */
		this.ajax = function (companyString, success) {

			// use for this purpose jQuery-function
			this.parent.ajax({
				url: "http://services.money.msn.com/quoteservice/streaming?symbol=" + companyString + "&format=json",
				error: function (e) {
					error();
					options.callback(false);
				},
				success: success
			});
		};

		/**
		 * We start the constructor
		 */
		this.init();
	};


	/**
	 * Register the utility as a static method of jQuery
	 */
	$.stockQuote = function (settings) {

		/**
		 * Default options
		 */
		var options = {
			service: "financecontent",
			company: [],
			callback: function () {}
		};

		/**
		 * Method validate input
		 */
		this.validate = {
			service: function () {
				if (typeof settings.service !== "string") {
					error("[settings.service] Parameter not defined or has the invalid format!");
					return false;
				}

				if (Models.hasOwnProperty(settings.service.toLowerCase())) {
					return true;
				} else {
					error("[settings.service] Service not found!");
					return false;
				}
			},
			company: function () {
				if (typeof settings.company !== "object") {
					error("[settings.company] Parameter not defined or has the invalid format!");
					return false;
				}

				if (settings.company.length > 0) {
					return true;
				} else {
					error("[settings.company] Not entered names companies!");
					return false;
				}
			},
			callback: function () {
				if (typeof settings.callback === "function") {
					return true;
				} else {
					error("[settings.callback] Parameter not defined or has the invalid format!");
					return false;
				}
			}
		};

		/**
		 * Checking input data, execution
		 */
		if (this.validate.service() && this.validate.company() && this.validate.callback()) {
			options.service = settings.service.toLowerCase();
			options.company = settings.company;
			options.callback = settings.callback;

			var obj = new Models[options.service](options);
		} else {
			return false;
		}
	};

})(jQuery);
