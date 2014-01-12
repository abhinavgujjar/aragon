// init.js
/*global $ */
/*global ko:false */
/*global console */
(function (learningModule, $) {
	'use strict';

	
	learningModule.vm = {
		module : ko.observable(''),
		videoLink : ko.observable(''),
		selectVideo: function(subTopic){
			var vp = $('#upVid')[0];
			var vpSource = $('#upVid source')[0];
			vpSource.src = subTopic.video;
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
	};

	learningModule.init = function () {
		console.log('module init');

		ko.applyBindings(learningModule.vm, $('#module-page')[0]);


	};

})(window.learningModule = window.learningModule || {}, $);