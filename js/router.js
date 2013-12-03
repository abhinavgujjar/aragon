// router.js
/*global $ */
/*global Sammy */
(function (router, $) {
	'use strict';
	router.app = Sammy('body', function () {

		var that = this;
		var $index = $('#main-page');
		var $listings = $('#listing-page');
		var $app = $('#app-page');
		var $log = $('#log-page');

		function swapPages(oldPage, newPage) {
			newPage.show();

			oldPage.hide('fast', function () {
				newPage.show('fast');
			});
		}

		var routes = [{
			path: '#/',
			callback: function (i) {
				$index.show();
				$listings.hide();
				$app.hide();
				$log.hide();
				//swapPages($listings, $index);
			}
		},
		{
			path: '#/listing',
			callback: function (i) {
				$index.hide();
				$listings.show();
				$app.hide();
				$log.hide();

				//clean out the app div
				//$('#appContainer').empty();
				//swapPages($index, $listings);
			}
		},
		{
			path: '#/app/:appId',
			callback: function (i) {
				$index.hide();
				$listings.hide();
				$app.show();
				$log.hide();

				var appId = this.params['appId'];

				var appListing = JSON.parse(window.localStorage.getItem('listing'));

				var appEntry = $.grep(appListing.result, function(item, index){
					return item.id === appId;
				})[0];

				window.applisting.vm.loadApp(appEntry);
				//swapPages($listings, $app);
			}
		},
		{
			path: '#/log',
			callback: function (i) {
				$index.hide();
				$listings.hide();
				$app.hide();
				$log.show();
				//swapPages($listings, $app);
			}
		}];

		$.each(routes, function (i, r) {
			that.get(r.path, r.callback);
		});
	});

	router.init = function () {
		var companyId = window.localStorage.getItem('companyId');

		var initialRoute = '#/';

		if ( companyId !== null && companyId !== undefined && companyId > 0){
			initialRoute = '#/listing';
		}

		router.app._checkFormSubmission = function () {
			return false;
		};
    
		router.app.run(initialRoute);
	};

})(window.router = window.router || {}, $);