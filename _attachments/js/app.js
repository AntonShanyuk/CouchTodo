(function (window) {
	'use strict';

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
			url: '/couchtodo', 
			data: JSON.stringify(item)
		}).then(function(){
			newItemInput.val('');
		});
		return false;
	});
})(window);
