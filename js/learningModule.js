// init.js
/*global $ */
/*global ko:false */
/*global console */
(function (learningModule, $) {
	'use strict';

	var browserPrefix = './videos/';
	var phonePrefix = 'file:///sdcard/Movies/quest/';

	learningModule.vm = {
		module : ko.observable(''),
		videoLink : ko.observable(''),
		selectedSubTopic : ko.observable(''),
		pause: function(){
			var vp = $('#upVid')[0];
			vp.pause();			
		},
		play: function(){
			var vp = $('#upVid')[0];
			vp.play();			
		},
		selectVideo: function(subTopic){

			learningModule.vm.selectedSubTopic(subTopic);

			var vp = $('#upVid')[0];
			var vpSource = $('#upVid source')[0];

			var prefix = browserPrefix;
			if ( window.cordova ){
				prefix = phonePrefix;
			}

			vpSource.src = prefix + subTopic.video;
			vp.load();
			vp.play();
		}
	};

	learningModule.load = function(groupId, moduleId){
		var group  = $.grep(toc.contents, function(item){
			return item.groupId == groupId;
		})[0];

		var module = $.grep(group.modules, function(item){
			return item.id == moduleId;
		})[0];

		learningModule.vm.module(module);
                var subTopic=module.topics[0].subTopics[0];
		//find the first video to play in the module
		trackVideo(subTopic);
		learningModule.vm.selectVideo(module.topics[0].subTopics[0]);

	};

	learningModule.init = function () {
		console.log('module init');

		ko.applyBindings(learningModule.vm, $('#module-page')[0]);


	};

})(window.learningModule = window.learningModule || {}, $);

function trackVideo(subTopic) {
// Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
        fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwrite = function(evt) {
        console.log("write success");
    };
    var username = document.loginForm.exampleInputEmail1.value;
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate()
    var year = currentTime.getFullYear()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    if (minutes < 10){
    minutes = "0" + minutes
     }
    writer.seek(writer.length);
    writer.write(username+","+day + "/" +month+ "/" + year +","+hours + ":" + minutes+"Logged In"+"\n");
    writer.abort();
    };

    function fail(error) {
        console.log(error.code);
    }
