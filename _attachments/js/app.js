(function (window) {
	'use strict';
	
	var items = [];
	var itemObservers = [];
	Object.observe(items, function(){
		var todoList = $('.todo-list');
		todoList.empty();
		
		itemObservers.forEach(function(itemObserver){
			Object.unobserve(itemObserver.item, itemObserver.observer);
		});
		itemObservers = [];
		
		items.forEach(function(item){
			var itemEl = createItemEl(item);
			todoList.append(itemEl);
			var observer = function(){
				var newItemEl = createItemEl(item);
				itemEl.replaceWith(newItemEl);
				itemEl = newItemEl;
			};
			Object.observe(item, observer);
			itemObservers.push({item: item, observer: observer});
		});
		
		function createItemEl(item){
			var el = $(itemTemplate.apply(item));
			var toggle = el.find('.toggle');
			toggle.on('change', function(){
				item.completed = toggle.is(':checked');
				update(item);
			});
			return el;
		}
	});
	
	$.ajax({
		type: 'GET',
		url: '_view/items',
		dataType: 'json'
	}).then(function(data){
		for(var i  in data.rows){
			var row  = data.rows[i];
			items.push(row.value);
		}
	});
	
	function update(item){
		return $.ajax({
			type: 'PUT',
			contentType: 'application/json',
			dataType: 'json',
			url: '/couchtodo/' + item._id, 
			data: JSON.stringify(item)
		});
	}
	
	$('.submit-form').on('submit', function(){
		var newItemInput = $('.new-todo');
		
		var item = {
			text: newItemInput.val(),
			completed: false,
			type: 'item'
		};
		
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			dataType: 'json',
			url: '/couchtodo', 
			data: JSON.stringify(item)
		}).then(function(response){
			item._id = response.id;
			items.unshift(item);
			newItemInput.val('');
		});
		return false;
	});
})(window);
