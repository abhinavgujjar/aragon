// init.js
/*global $ */
/*global ko:false */
/*global console */
(function (index, $) {
	'use strict';

	
	index.vm = {
		showError: ko.observable(false),
		token: ko.observable(''),
		errorMessage: ko.observable(''),
		submit: function (data, event){

			$(event.target).closest('form').submit();
			return false;
		},
		gotomain: function(){
			document.location.href = '#/';
		},
		signin: function (formElement){

			index.vm.showError(false);
			index.vm.errorMessage('');

			//do validation from server
			$.post(signinUrl, $(formElement).serialize())
			.done(successfulSignIn)
			.fail(failedSignIn);
		}
	};

	function successfulSignIn(data){
		console.log('successful : ' + data);
		var json = $.parseJSON(data);
		var companyId = json.companyId;

		if ( companyId == 0)
		{

			failedSignIn(null, "Invalid User Name and Password");
		}
		else
		{
			window.localStorage.setItem('companyId', companyId);
			window.localStorage.setItem('token', index.vm.token());
			document.location.href = '#/listing';
		}
	}

	function failedSignIn(jqXHR, textStatus, errorThrown){
		console.log('failed to sign in: ' + textStatus + ', ' + errorThrown);
		index.vm.showError(true);
		index.vm.errorMessage('Problem signing in -' + textStatus);

	}

	index.init = function () {
		console.log('index init');

		$.support.cors = true;
		ko.applyBindings(index.vm,$('#main-page')[0]);
	};

})(window.index = window.index || {}, $);