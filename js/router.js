// router.js
/*global $ */
/*global Sammy */
(function (router, $) {
	'use strict';
	router.app = Sammy('body', function () {

		var that = this;
		var $main = $('#main-page');
		var $login = $('#login-page');

		function swapPages(oldPage, newPage) {
			newPage.show();

			oldPage.hide('fast', function () {
				newPage.show('fast');
			});
		}

		var routes = [{
			path: '#/',
			callback: function (i) {
				$login.show();
				$main.hide();
				
				//swapPages($listings, $index);
			}
		},
		{
			path: '#/main',
			callback: function (i) {
				$login.hide();
				$main.show();
				

				//clean out the app div
				//$('#appContainer').empty();
				//swapPages($index, $listings);
			}
		}];

		$.each(routes, function (i, r) {
			that.get(r.path, r.callback);
		});
	});

	router.init = function () {
		router.app._checkFormSubmission = function () {
			return false;
		};
    
		router.app.run("#/");
	};

})(window.router = window.router || {}, $);