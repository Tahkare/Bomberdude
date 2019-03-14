let level_load = function(filename) {
	console.log(filename);
	let file = new File([],filename);
	console.log(file);
	let reader = new FileReader();
	reader.readAsText(file);
	reader.loadend = function(event) {
		console.log(event);
	};
	console.log(reader);
	console.log(reader.result);
}
