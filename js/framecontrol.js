// init.js
/*global $ */
'use strict';

function showSlideNext(slide)
{   
	$('.divslide').hide();
	$('.slidenavpub').hide();
	$('#divslide'+slide).show();
	$('#slidenavpub'+slide).show();
}
function showSlidePrev(slide)
{   
	$('.divslide').hide();
	$('.slidenavpub').hide();
	$('#divslide'+slide).show();
	$('#slidenavpub'+slide).show();
}

function goToSlide(originId, destinationId, index, submit)
{   
	if(submit == '1')
		saveFormData();

	var handle = $('#formfieldholder'+index).attr('data-tydy-handle');
	var type = $('#formfieldholder'+index).attr('data-tydy-type');

	tydyapp.trackClicks(originId, destinationId, handle, type);


	
	$('#formfield'+index).val('1');
	$('.divslidepub').hide();
	$('.slidenavpub').hide();
	$('#divslide'+destinationId).show();
	$('#slidenavpub'+destinationId).show();

	var vheight = $(window).height();
	var vheightint = parseInt(vheight);
	var dheight = 0;
	$('.sortdivnone').each(function(){
		dheight += $(this).height();
	});

	var dheightint = parseInt(dheight);

	var diffheight = vheightint - dheightint;
	var diffheighttop = diffheight/2;

	
}

function goToUrl(url, index)
{   
	$('#formfield'+index).val('1')
	window.open(url, '_blank');
					//$('.divslide').hide();
					//$('.slidenavpub').hide();
					//$('#divslide'+slide).show();
					//$('#slidenavpub'+slide).show();
				}

				function checkAdd(i)
				{
					$('#formfield'+i).val('') 
					$('.chkfield'+i).each(function(){                   
						var chkval = $(this).val();
						if($(this).is(':checked'))
						{
							$('#formfield'+i).val(function(i,val) { 
								return val + (val ? ',' : '') + chkval;
							});
						}
					})
				}

				function checkAddRadio(k,i)
				{
					$('#formfield'+i).val('') 
					$('.radiofield'+i).each(function(){                                        
						$(this).removeAttr('checked');
						$(this).parent().removeClass('checked');
						$('.formradio'+i).removeClass('radiochecked');

					});
					$('#radiofield'+k+i).attr('checked', 'checked');
					$('#radiofield'+k+i).parent().addClass('checked');
					$('#formradiogrp'+k+i).addClass('radiochecked');
					$('#formfield'+i).val($('#radiofield'+k+i).val())
				}   
				function saveFormData()
				{
					var formid = 148;
					var formfields = []
					for (var i=0;i<=11;i++)
					{ 
						formfields.push($('#formfield'+i).val());
					}
					console.log(formfields);
					$.post('saveformdata.php', {'formdata': formfields, 'formid': formid}, function(response){
						$('#sendform').trigger('reset');
					});
					console.log('1')
				}
				
