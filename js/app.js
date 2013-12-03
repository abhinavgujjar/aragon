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

	app.resetStorage = function(flush){

		console.log('resetting storage');
		
		if ( flush){
			window.localStorage.removeItem('tydyStorage');
			window.localStorage.removeItem('clickTracker');
		}

		var tydyStorage =  window.localStorage.getItem('tydyStorage');

		if ( tydyStorage=== undefined || tydyStorage === null){
			tydyStorage = {instances: []};
			window.localStorage.setItem('tydyStorage', JSON.stringify(tydyStorage));
		}

		var clickTracker = window.localStorage.getItem('clickTracker');

		if (clickTracker === undefined || clickTracker === null  ){
			clickTracker = {instances: []};
			window.localStorage.setItem('clickTracker', JSON.stringify(clickTracker));
		}
	};

	app.setDownloadLocation = function(){
		var downloadLocation = window.localStorage.getItem('downloadLocation');

		console.log('download location from local storage : ' + downloadLocation);

		if ( downloadLocation === null || downloadLocation === undefined){

			console.log('determining download location');

			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,

				function onFileSystemSuccess(fileSystem) {

					fileSystem.root.getFile(
						'dummy.txt', {create: true, exclusive: false},

						function gotFileEntry(fileEntry) {
							console.log('created dummy file');

							var localFilePath = fileEntry.fullPath;

							downloadLocation = localFilePath.substring(0, localFilePath.lastIndexOf('/') + 1);

							window.localStorage.setItem('downloadLocation', downloadLocation);
							app.downloadLocation = downloadLocation;

							fileEntry.remove();
						});
				});
		}
		else{
			app.downloadLocation = downloadLocation;
		}
	};

	// Initialization
	function init() {
		if (window.logPage) logPage.init();

		console.log('app init start');

		app.resetStorage(false);

		if ( window.cordova){
			app.setDownloadLocation();
		}

		if (window.index) index.init();
		// if (window.applisting) applisting.init();
		// if (window.tydyapp) tydyapp.init();
		// if (window.router) router.init();

		$('.back-button').on('click', function () {
			window.history.go(-1);
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