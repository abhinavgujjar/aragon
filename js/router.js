// router.js
/*global $ */
/*global Sammy */
(function (router, $) {
	'use strict';
	router.app = Sammy('body', function () {

		var that = this;
		var $landing = $('#landing-page');
		var $login = $('#login-page');
		var $module = $('#module-page');

		var routes = [
		{
			path: '#/',
			callback: function (i) {
				$login.show();
				$landing.hide();
				$module.hide();
				
				learningModule.vm.pause();
				
			}
		},
		{
			path: '#/landing',
			callback: function (i) {
				$login.hide();
				$landing.show();
				$module.hide();

				learningModule.vm.pause();
			}
		},
		{
			path: '#/module/:groupId/:moduleId',
			callback: function (i) {
				$login.hide();
				$landing.hide();
				$module.show();

				var groupId = this.params.groupId;
				var moduleId = this.params.moduleId;
				learningModule.load(groupId, moduleId);
				//swapPages($listings, $app);
			}
		},
		];

		$.each(routes, function (i, r) {
			that.get(r.path, r.callback);
		});
	});

	router.init = function () {
		router.app._checkFormSubmission = function () {
			return false;
		};

		router.app.run('#/');
	};

})(window.router = window.router || {}, $);