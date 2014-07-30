// app.js
/*global $ */
/*global index */
/*global console */
/*global router  */
/*global applisting  */
/*global tydyapp  */
/*global LocalFileSystem */
/*global logPage */
(function (app, $) {
	'use strict';

	app.downloadLocation = undefined;

	
	// Initialization
	function init() {

		console.log('app init start');

		
		if (window.index) index.init();
		if (window.router) router.init();
		if (window.landing) landing.init();
		if (window.learningModule)learningModule.init();

		$('.back-button').on('click', function () {
			 window.history.go(-1);
			 if (window.index){
                             var loginStatus="Logged Out";
				loginTrack(loginStatus);
			 }
			return false;
		});

		console.log('app init end');

	}

	// Startup 
	if (window.cordova) {
		document.addEventListener('deviceready', init, false);
	}
	else {
		$(document).ready(init);
	}

})(window.app = window.app || {}, $);