keydown_event(event) {
	console.log(event.key);
}

document.getElementById("cvn").addEventListener("keydown", keydown_event);
