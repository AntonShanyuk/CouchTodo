function(doc){
	if(doc.type == 'item' && doc.completed){
		emit(doc._id, doc);
	}
}