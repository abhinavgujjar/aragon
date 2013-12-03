// init.js
/*global $ */
/*global ko:false */
/*global console */
(function (logPage, $) {
	'use strict';

	logPage.baseTime = $.now();

	logPage.vm = {
		logs: ko.observableArray([]),
		refresh: function (){
			return false;
		}
	};

	logPage.init = function () {
		var tempConsole = console;
		window.console = {};
		console.log = function(message){

			var elapsedTime = $.now() - logPage.baseTime;

			message = '[' + elapsedTime + ']: ' + message;

			if ( logPage.vm.logs().length > 100){
				logPage.vm.logs.shift();
			}

			logPage.vm.logs.push(message);

			tempConsole.log(message);
		};

		console.log('logging something');

		ko.applyBindings(logPage.vm,$('#log-page')[0]);
	};
	

})(window.logPage = window.logPage || {}, $);