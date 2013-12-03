// init.js
/*global $ */
/*global ko:false */
/*global LocalFileSystem */
/*global console */
/*global FileTransfer */
(function (applisting, $) {
	'use strict';

	var serverAddress = 'https://www.tydy.it/app/';
	var uploadUrl = 'https://www.tydy.it/app/syncdata';
	var clickUploadUrl = 'https://www.tydy.it/app/syncclick';

	function refreshSyncInfo(){
		var tydyStorage =  JSON.parse(window.localStorage.getItem('tydyStorage'));
		applisting.vm.pendingUploads(tydyStorage.instances.length);
	}

	function injectHtml(data){
		//console.log('injecting : ' + data);
		var container = $('#appContainer');
		container.fadeOut(200, function(){
			container.empty().append(data).fadeIn(500);

			injectHTMLInner(data);
		});
	}
	
	function injectHTMLInner(){

		// $('#appContainer').empty();
		// $('#appContainer').append(data);

		var address = null;
		if ( window.cordova){
			address = window.app.downloadLocation;
		}
		else{
			address = serverAddress;
		}
		$('#appContainer a[data-video=\'true\']').each(function(){
			var src =  $(this).attr('href');

			if ( window.cordova){
				src = src.substring(src.lastIndexOf('/') + 1);
			}

			$(this).attr('href', address + src);

			console.log('new video location : ' + address + src);
		});


		$('#appContainer img').each(function(){
			var src =  $(this).attr('src');

			if ( window.cordova){
				src = src.substring(src.lastIndexOf('/') + 1);
			}

			$(this).attr('src', address + src);

			console.log('new image : ' + address + src);
		});

		$('#appContainer .divslidepub').each(function(){

			if ( $(this).css('background-image') !== 'none' ){

				var bgImage = $(this).css('background-image');

				var urlstr = bgImage.split('/');

				var relurl =  null;
				if ( !window.cordova){
					relurl = urlstr[urlstr.length-2] +'/'+ urlstr[urlstr.length -1];
				}
				else{
					relurl = urlstr[urlstr.length -1];
				}


				var completeBgUrl = 'url('+ address + relurl + '';

					$(this).css('background-image', completeBgUrl);

					console.log('hacked url' + completeBgUrl);
				}
			});


		initializeTydyApp(applisting.vm.currentAppId);
		
	}

	function initializeTydyApp(appId){
		window.tydyapp.init(appId);
	}

	function loadAppFromServer( appEntry){
		var url = appEntry.html;

		$.ajax({
			url: url,
			dataType: 'html',
			success: function (data) {

				injectHtml(data);

			},
			error: function () {
				console.log('could not download html from tydy bitch');
				applisting.vm.msg('Failed to load data');
			}

		});
	}

	function incrementFileCount(failed){

		failed = failed || false;

		if ( failed ){
			applisting.vm.filesFailed(applisting.vm.filesFailed() + 1);
		}

		applisting.vm.filesDownloaded(applisting.vm.filesDownloaded()+ 1);

		if ( applisting.vm.filesDownloaded() >= applisting.vm.totalFiles()){
			loadingComplete();
			updateSyncTime();
		}
	}

	function updateSyncTime(){
		var currentDate = new Date();
		applisting.vm.lastSync(formatDate(currentDate));
		window.localStorage.setItem('lastSync', currentDate);
	}

	function loadingComplete(){
		applisting.vm.loading(false);

	}

	function fakeDownloadAssets(){

		var total = 30;

		applisting.vm.totalFiles(total);

		var current_perc = 0;
		var progress = setInterval(function() {
			if (current_perc>=total) {
				clearInterval(progress);
				loadingComplete();
			} else {
				current_perc = current_perc + 1;
				incrementFileCount(true);
			}
		}, 250);
	}

	function doneUploading(storageElement){
		console.log('Upload Successfull');

		window.localStorage.removeItem(storageElement);

		//reset the localstorage
		window.app.resetStorage(false);
	}

	function failedUploading(){
		console.log('failed to upload the data');
	}

	function uploadData(){
		var data = window.localStorage.getItem('tydyStorage');

		var clickData = window.localStorage.getItem('clickTracker');

		$.post(uploadUrl, data)
		.done(function () { doneUploading('tydyStorage');})
		.fail(failedUploading)
		.always(refreshSyncInfo);

		$.post(clickUploadUrl, clickData)
		.done(function () { doneUploading('clickTracker');})
		.fail(failedUploading)
		.always(refreshSyncInfo);
	}

	function downloadAssets(data){

		var totalCount = 0;
		totalCount = totalCount + data.result.length;

		$.each(data.result, function (index, value){
			totalCount = totalCount + value.assets.length;
		});

		applisting.vm.totalFiles(totalCount);

		console.log('total file : ' + totalCount);

		$.each(data.result, function (index, value){

			//download the main html file
			var fileName = value.id + '.html';
			var serverPath = value.html;
			checkAndDownload(serverPath, fileName, true);

			$.each( value.assets, function (innerIndex, innerValue){
				var serverPath = serverAddress + innerValue;
				var fileName = innerValue.substring(innerValue.lastIndexOf('/') + 1);
				checkAndDownload(serverPath, fileName);
			});
		});
	}

	function loadAppFromFile( appEntry){
		var fileName = appEntry.id + '.html';
		console.log('loading ' + fileName);

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
			function gotFS(fileSystem) {
				fileSystem.root.getFile(fileName, null, gotFileEntry, fail);
			}, fail);
	}


	function gotFileEntry(fileEntry) {
		fileEntry.file(gotFile, fail);
	}

	function gotFile(file){
		readAsText(file);
	}

	function readAsText(file) {
		var reader = new FileReader();

		reader.onloadend = function(evt) {
			console.log('Read as text');

			var data = evt.target.result;
			injectHtml(data);
		};

		reader.readAsText(file);
	}

	function fail(evt) {
		console.log(evt.target.error.code);
	}

	function downloadAsset(localFilePath, serverPath){


		console.log ('downloading from ' + serverPath + ' to' + localFilePath);

		var fileTransfer = new FileTransfer();

		fileTransfer.download(
			serverPath,
			localFilePath ,
			function(downloadedFile) {
				console.log('download complete: ' + downloadedFile.toURL());
				console.log(downloadedFile.toURL());
				incrementFileCount();
			},
			function(error) {
				console.log('download error source ' + error.source);
				console.log('download error target ' + error.target);
				console.log('dowload error code: ' + error.code);
				incrementFileCount(true);
			}
			);
	}

	function checkAndDownload(serverPath, localFileName, force) {

		force = force || false;

		var localFilePath = window.app.downloadLocation + '/' + localFileName;

		if (force){
			downloadAsset(localFilePath, serverPath);
		}
		else{
			checkFileExists(localFilePath,
				function() {
					console.log(localFileName + ' is already present on disk');
					incrementFileCount();
				},
				function () { downloadAsset(localFilePath, serverPath); }
				);
		}
	}

	function checkFileExists(path, fileExists, fileDoesNotExist){
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
			fileSystem.root.getFile(path, { create: false }, fileExists, fileDoesNotExist);
		}, getFSFail);
	}

	function getFSFail(){
		console.log('Error in accessing file');
	}

	function renderListings(){
		var listingData =  JSON.parse(window.localStorage.getItem('listing'));

		if ( listingData !== undefined && listingData !== null)
		{
			if ( listingData.result.length > 0 ){
				$.each(listingData.result, function (i, item) {
					applisting.vm.items.push(item);
				});
			}
			else{
				applisting.vm.noAppsFound(true);
			}
		}
		else
		{
			applisting.vm.firstTime(true);
		}
	}

	function syncAll(){

		applisting.vm.noAppsFound(false);
		applisting.vm.firstTime(false);
		applisting.vm.loading(true);
		applisting.vm.filesDownloaded(0);
		applisting.vm.filesFailed(0);
		applisting.vm.items.removeAll();

		uploadData();

		$.ajax({
			url: 'https://www.tydy.it/app/api.list?cid=' + window.localStorage.getItem('companyId'),
			dataType: 'json',
			success: function (data) {

				if (data !== null && data !== undefined && data.result.length > 0){
					window.localStorage.setItem('listing', JSON.stringify(data));

					renderListings();

					if ( window.cordova){
						downloadAssets(data);
					}
					else{
						fakeDownloadAssets(data);
					}
				}
				else{
					applisting.vm.noAppsFound(true);
					applisting.vm.loading(false);
				}

			},
			error: function () {
				applisting.vm.msg('Failed to load data');
			}
		});
	}

	function formatDate(targetDate){
		targetDate = new Date(targetDate);
		return targetDate.getDate() + '/' + (targetDate.getMonth() + 1)  + '/' + targetDate.getFullYear();
	}

	applisting.vm = {
		items: ko.observableArray([]),
		msg: ko.observable(''),
		percentageComplete: ko.observable('50'),
		loading: ko.observable(false),
		totalFiles: ko.observable(0),
		filesFailed: ko.observable(0),
		filesDownloaded: ko.observable(0),
		currentAppId: 0,
		pendingUploads: ko.observable(0),
		firstTime: ko.observable(false),
		noAppsFound: ko.observable(false),
		lastSync: ko.observable(formatDate(window.localStorage.getItem('lastSync'))),
		gotomain: function(){
			document.location.href = '#/';
		},
		showLog: function(){
			window.location.href='#/log';
		},
		getModulo: function (input){
			return input % 4;
		},
		synchronize : syncAll,
		loadApp: function(appEntry){
			applisting.vm.currentAppId = appEntry.id;
			if ( window.cordova )
			{
				loadAppFromFile( appEntry);
			}
			else{
				loadAppFromServer( appEntry);
			}
		},

		continueWithErrors: function(){
			applisting.vm.filesFailed(0);
			applisting.vm.loading(false);
		}
	};

	applisting.init = function () {
		console.log('app listing init');

		$.support.cors = true;

		ko.applyBindings(applisting.vm, $('#listing-page')[0]);

		refreshSyncInfo();

		renderListings();

		console.log('app listing init end');
	};

})(window.applisting = window.applisting || {}, $);