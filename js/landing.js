// init.js
/*global $ */
/*global ko:false */
/*global console */
(function (landing, $) {
	'use strict';

	
	landing.vm = {
	groups : toc.contents
	};


	landing.init = function () {
		console.log('index init');

		$.support.cors = true;
		ko.applyBindings(landing.vm, $('#landing-page')[0]);


	};

})(window.landing = window.landing || {}, $);