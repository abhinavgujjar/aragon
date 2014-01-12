// init.js
/*global $ */
/*global ko:false */
/*global console */
(function (index, $) {
	'use strict';

	
	index.vm = {
	};


	index.init = function () {
		console.log('index init');

		$.support.cors = true;
		ko.applyBindings(index.vm,$('#main-page')[0]);
	};

})(window.index = window.index || {}, $);