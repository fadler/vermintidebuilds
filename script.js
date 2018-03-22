'use strict';
var _data;
var career_select;
var talents_div;

function resetTalents() {
	talents_div.find('.talent > .talent-content').text('');
	talents_div.find('.alert-success').removeClass('alert-success');
}

function onTalentClick(e) {		
	$(this).closest('.talents').find('.alert-success').removeClass('alert-success');
	$(this).addClass('alert-success');
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
	for (var i =0; i < talents.length; i++) {
		var tier_div = talents_div.find('#talents-' + i);
		var tier = talents[i];
		var talent_col = tier_div.children().first();
		for (var j = 0; j< tier.length; j++) {
			talent_col.find('.talent-content').text(tier[j]);
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
	
	talents_div.on('click','.talent-content',onTalentClick);
}

$(function() {
	career_select = $('#career-select');
	talents_div = $('#talents-div');	
	
	$.ajax({
		url: 'data.json',
		dataType: 'json',
		success: function(data) {
			_data = data;
			initData();
		}
	});
});