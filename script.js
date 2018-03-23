'use strict';
var _data;
var career_select;
var talents_div;
var share_link;

function updateHash(hash){
	if(history.pushState){
	    history.pushState(null, null, hash);
	}else{
	    location.hash = hash;
	}
}

function resetTalents() {
	var talent_content = talents_div.find('.talent > .talent-content');
	talent_content.find('.talent-name').text();
	talent_content.find('.talent-description').text();
	talents_div.find('.alert-success').removeClass('alert-success');
	updateHash('#');
	share_link.closest('#share-link-container').prop('hidden', true);
	share_link.val();
}

function onTalentClick(e) {		
	$(this).closest('.talents').find('.alert-success').removeClass('alert-success');
	$(this).addClass('alert-success');
	
	var talents_div = $(this).closest('#talents-div');
	var talents_alert_success = talents_div.find('.alert-success');
	if(talents_alert_success.length == (talents_div.find('.alert').length) / 3){
		var hash = '#' + career_select.val();
		talents_alert_success.each(function(){
			hash += $(this).closest('.talent').attr('data-talent');
		});
		updateHash(hash);
		share_link.closest('#share-link-container').removeAttr('hidden');
		share_link.val(location);
	}
}

function onCareerSelect(e) {
	resetTalents();
	if (this.value == '-1') {
		talents_div.prop('hidden',true);
		return;
	}
	var val_hero = this.value[0];
	var val_career = this.value[1];
	
	var career = _data[val_hero].careers[val_career];
	var talents = career.talents;
	for (var i = 0; i < talents.length; i++) {
		var tier_div = talents_div.find('#talents-' + i);
		var tier = talents[i];
		var talent_col = tier_div.children().first();
		for (var j = 0; j< tier.length; j++) {
			var talent_content = talent_col.find('.talent-content');
			talent_content.find('.talent-name').text(tier[j]['name']);
			talent_content.find('.talent-description').text(tier[j]['description']);
			talent_col = talent_col.next();
		}
	}
	talents_div.removeAttr('hidden');
}

function initData() {
	career_select.append('<option value="-1">- select career -</option>');
	for(var i = 0; i < _data.length; i++) {
		var item = _data[i];
		var opt_group = $('<optgroup></optgroup>').attr('label',item.name);
		var careers = item.careers;
		for (var j = 0; j < careers.length; j++) {			
			opt_group.append($('<option></option>').attr('value',i + '' + j).text(careers[j].name));
		}
		career_select.append(opt_group);
	}
	
	career_select.on('change', onCareerSelect);
	
	talents_div.on('click','.talent-content', onTalentClick);
	
	$('#copy-link').click(function(){
		share_link.select();
		document.execCommand("copy");
		share_link.blur();
	});
	
	
	var hash = location.hash;
	if(hash.length === 8){
		var params = hash.split('');
		career_select.val(params[1] + '' + params[2]).change();
		
		var index = 3;
		talents_div.find('.talents').each(function(){
			var tier_talents = $(this).find('.talent:eq('+ params[index++] +')');
			tier_talents.find('.talent-content').click();
		});
	}
}

$(function() {
	career_select = $('#career-select');
	talents_div = $('#talents-div');	
	share_link = $('#share-link');
	
	$.ajax({
		url: 'data.json',
		cache: false,
		dataType: 'json',
		success: function(data) {
			_data = data;
			initData();
		}
	});
});