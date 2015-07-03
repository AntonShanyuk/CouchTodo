function(doc){
	if(doc.type == 'item'){
		emit(doc._id, doc);
	}
}