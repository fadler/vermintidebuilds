'use strict';
var _data;
var career_select;
var talents_div;
var share_link;
var save_to_storage_button;
var save_to_storage_input;
var storage_list;
var storage_div;
var storage_btn;
var passives;
var skill;

function loadStorage(){
	var string = localStorage.getItem("vermintidebuilds_storage");
	if(string === null){
		return {};
	}
	return JSON.parse(string);
}

function removeFromStorage(name)
{
	var storage = loadStorage();
	delete storage[name];
	localStorage.setItem("vermintidebuilds_storage", JSON.stringify(storage));
}

function saveToStorage(name, hash){
	var storage = loadStorage();
	storage[name] = hash;
	localStorage.setItem("vermintidebuilds_storage", JSON.stringify(storage));
}

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
	passives.html('');
	skill.html('');
	talents_div.find('.alert-danger').removeClass('alert-danger');
	updateHash('#');
	share_link.closest('#build-done-stuff').prop('hidden', true);
	share_link.val();
}

function onTalentClick(e) {		
	$(this).closest('.talents').find('.alert-danger').removeClass('alert-danger');
	$(this).addClass('alert-danger');
	
	var talents_div = $(this).closest('#talents-div');
	var talents_alert_success = talents_div.find('.alert-danger');
	if(talents_alert_success.length == (talents_div.find('.alert').length) / 3){
		var hash = '#' + career_select.val();
		talents_alert_success.each(function(){
			hash += $(this).closest('.talent').attr('data-talent');
		});
		updateHash(hash);
		share_link.closest('#build-done-stuff').removeAttr('hidden');
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
	
	$.each(career.passives, function(key, value){
		passives.append('<div class="carrer-title">'+ value.name +'</div>');
		passives.append('<div>'+ value.description +'</div>');
	});	
	skill.append('<div class="carrer-title">'+ career.skill.name +'</div>');
	skill.append('<div>'+ career.skill.description +'</div>');
	
	talents_div.removeAttr('hidden');
}

function onCopyLinkClick(e) {
	share_link.select();
	document.execCommand("copy");
	share_link.blur()
}

function onSaveToStorageInputChange(e) {
	save_to_storage_button.prop('disabled', $(this).val().length === 0);
}

function onSaveToStorageClick(e) {
	var name = save_to_storage_input.val();
	var hash = location.hash;
	var current_career = career_select.find('option:selected').text();
	saveToStorage(current_career + ' - ' + name, hash);
	save_to_storage_input.val('');
	save_to_storage_input.change();
	initStorageSelect();
}

function loadBuild(hash){
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

function initStorageSelect(){
	var storage = loadStorage();
	if (Object.keys(storage).length == 0) {
		return;
	}
	$('#storage-btn-div').removeAttr('hidden');
	
	var item_template = $('<li></li>').addClass('list-group-item storage-item')
		.append($('<div></div>').addClass('row')
				.append($('<div></div>').addClass('col-sm col-12 storage-item-label'))
				.append($('<div></div>').addClass('col-sm col-12 storage-item-buttons')
						.append($('<a></a>').attr('href','').addClass('btn btn-secondary storage-item-load').text('Load'))
						.append('&nbsp;')
						.append($('<a></a>').attr('href','').addClass('btn btn-secondary storage-item-delete').text('Delete'))
				)
		);
	storage_list.html('');
	$.each(storage, function (key, value){
		var item = item_template.clone();
		item.data('hash',value);
		item.data('name',key);
		item.find('.storage-item-label').text(key);
		storage_list.append(item);
	});		
}

function onStorageItemLoad(e){
	e.preventDefault();
	var value = $(this).closest('.storage-item').data('hash');		
	loadBuild(value);
}

function onStorageItemDelete(e) {
	e.preventDefault();
	var item = $(this).closest('.storage-item');
	var name = item.data('name');		
	removeFromStorage(name);
	item.remove();
	
	var storage = loadStorage();
	if (Object.keys(storage).length == 0) {
		$('#storage-btn-div').prop('hidden',true);
		storage_div.prop('hidden',true);
		storage_btn.find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
	}
}

function onStorageBtn(e) {
	e.preventDefault();
	var hidden = storage_div.prop('hidden');
	storage_div.prop('hidden',!hidden);	
	var icon = $(this).find('i');	
	icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
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
	
	talents_div.on('click','#copy-link', onCopyLinkClick);
	
	save_to_storage_input.on('keyup change', onSaveToStorageInputChange);
	
	save_to_storage_button.on('click', onSaveToStorageClick);

	loadBuild(location.hash);
	
	initStorageSelect();
	storage_list.on('click','.storage-item-load', onStorageItemLoad);
	storage_list.on('click','.storage-item-delete', onStorageItemDelete);
	storage_btn.on('click',onStorageBtn);
}

$(function() {
	career_select = $('#career-select');
	talents_div = $('#talents-div');	
	share_link = $('#share-link');
	save_to_storage_button = $('#save-to-storage-button');
	save_to_storage_input = $('#save-to-storage-input');
	storage_list = $('#storage-list');
	storage_div = $('#storage-div');
	storage_btn = $('#storage-btn');
	passives = $('#passives');
	skill = $('#skill');
	
	
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