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
			
			el.find('.destroy').click(function(){
				$.ajax({
					type: 'DELETE',
					url: `/couchtodo/${item._id}?rev=${item._rev}`,
					dataType: 'json'
				}).then(function(){
					el.remove();
					var index = items.indexOf(item);
					items.splice(index, 1);
				});
			});
			return el;
		}
	});
	
	function loadItems(url, filter){
		return $.ajax({
			type: 'GET',
			url: url,
			dataType: 'json'
		}).then(function(data){
			items.length = 0;
			for(var i  in data.rows){
				var row  = data.rows[i];
				items.push(row.value);
			}
			$('.filters a.selected').removeClass('selected');
			$(filter).addClass('selected');
		});
	}
	
	loadItems('_view/items', '.filters .all a');
	
	function update(item){
		return $.ajax({
			type: 'PUT',
			contentType: 'application/json',
			dataType: 'json',
			url: `/couchtodo/${item._id}`, 
			data: JSON.stringify(item)
		}).then(function(response){
			item._rev = response.rev;
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
			item._rev = response.rev;
			items.unshift(item);
			newItemInput.val('');
		});
		return false;
	});
	
	$('.filters .all').click(function(){
		loadItems('_view/items', '.filters .all a');
	})
	
	$('.filters .active').click(function(){
		loadItems('_view/active-items', '.filters .active a');
	})
	
	$('.filters .completed').click(function(){
		loadItems('_view/completed-items', '.filters .completed a');
	})
})(window);
