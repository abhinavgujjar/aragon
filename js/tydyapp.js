// init.js
/*global $ */
/*global ko:false */
/*global console*/
(function (tydyapp, $) {
	'use strict';

	tydyapp.clicks = [];

	var saveClicks = setInterval(function(){
		var tempArray = tydyapp.clicks.slice(0);

		if ( tempArray.length > 0 ){

			tydyapp.clicks = [];

			var clickTracker = JSON.parse( window.localStorage.getItem('clickTracker'));

			var instance = $.grep(clickTracker.instances, function (item, index){
				return (item.instanceId == tydyapp.vm.instanceId && item.appId == tydyapp.vm.appId );
			})[0];

			if ( instance === undefined){
				instance = {
					instanceId : tydyapp.vm.instanceId,
					appId: tydyapp.vm.appId,
					clicks : [],
				};

				clickTracker.instances.push(instance);
			}

			$.each(tempArray, function (index, item){
				instance.clicks.push(item);
			});


			window.localStorage.setItem('clickTracker', JSON.stringify(clickTracker));
		}
	}, 1000);

	tydyapp.trackClicks = function(origin, destination, handle, type){

		var clickEntry = {
			o: origin,
			d: destination,
			h: handle,
			t: type
		};

		tydyapp.clicks.push(clickEntry);

	};

	function addFormData(formData){

		var tydyStorage = JSON.parse( window.localStorage.getItem('tydyStorage'));

		var instance = $.grep(tydyStorage.instances, function (item, index){
			return (item.instanceId == tydyapp.vm.instanceId && item.appId == tydyapp.vm.appId );
		})[0];

		if ( instance === undefined){
			instance = {
				instanceId : tydyapp.vm.instanceId,
				appId: tydyapp.vm.appId,
				forms : [],
			};

			tydyStorage.instances.push(instance);
		}

		instance.forms.push(formData);

		window.localStorage.setItem('tydyStorage', JSON.stringify(tydyStorage));
	}

	tydyapp.vm = {
		instanceId : 0,
		appId : 0,
		mediaPlay: function (uri){
			$('#upVid')[0].webkitRequestFullScreen();
		},
		saveData: function (formElement){
			console.log('saving data-tydy');

			//select all input elements with tydy attribute
			var formId = $(formElement).attr('id');
			console.log('form Id : ' + formId);
			var formData = {
				formId : formId,
				entries : []
			};

			var fields = $(formElement).find(':input[data-tydy=\'true\']');

			$.each(fields, function(index, value){

				var name = $(value).attr('data-tydy-name');
				if ( name === undefined){
					name = value.id;
				}

				formData.entries.push({ key: name, value: value.value});

				console.log(' name  : ' + name + '; value : ' + value.value);
			});

			addFormData(formData);
			$(event.target).closest('form').find('input:text, select, textarea').val('');
            $(event.target).closest('form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
            $(event.target).closest('form').find('.formradiogrp').removeClass('radiochecked');

			return false;
		},
		submit: function (data, event){
			console.log('submitting');

			$(event.target).closest('form').submit();
			

			var gotoParams = $(event.currentTarget).attr('data-tydy-goto');

			if ( gotoParams !== undefined && gotoParams !== null){
				var params = JSON.parse(gotoParams);

				goToSlide(params.originId, params.destinationId, params.index, params.submit);
			}

		},
	};

	function initializeData(appId){
		tydyapp.vm.instanceId = $.now();
		tydyapp.vm.appId = appId;

	}

	tydyapp.init = function (appId) {
		console.log('binding tydy app with appId ' + appId);
		ko.applyBindings(tydyapp.vm, $('#app-page')[0]);

		if( appId !== undefined ){
			initializeData(appId);
		}
	};

})(window.tydyapp = window.tydyapp || {}, $);