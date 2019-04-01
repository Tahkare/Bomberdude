let keydown_event = function(event) {
	if (event.keyCode == 37) level.start_move(level.player_list[0], "LEFT");
	if (event.keyCode == 38) level.start_move(level.player_list[0], "UP");
	if (event.keyCode == 39) level.start_move(level.player_list[0], "RIGHT");
	if (event.keyCode == 40) level.start_move(level.player_list[0], "DOWN");
	if (event.keyCode == 90 && level.player_list.length ==2) level.start_move(level.player_list[1], "UP");
	if (event.keyCode == 81 && level.player_list.length ==2) level.start_move(level.player_list[1], "LEFT");
	if (event.keyCode == 83 && level.player_list.length ==2) level.start_move(level.player_list[1], "DOWN");
	if (event.keyCode == 68 && level.player_list.length ==2) level.start_move(level.player_list[1], "RIGHT");
	if (event.keyCode == 80) level.start();
	if (event.keyCode == 16) level.drop_bomb(level.player_list[0]);
	if (event.keyCode == 32 && level.player_list.length ==2) level.drop_bomb(level.player_list[1]);
}

let keyup_event = function(event) {
	if (event.keyCode == 37) level.start_move(level.player_list[0], "none");
	if (event.keyCode == 38) level.start_move(level.player_list[0], "none");
	if (event.keyCode == 39) level.start_move(level.player_list[0], "none");
	if (event.keyCode == 40) level.start_move(level.player_list[0], "none");
	if (event.keyCode == 90 && level.player_list.length ==2) level.start_move(level.player_list[1], "none");
	if (event.keyCode == 81 && level.player_list.length ==2) level.start_move(level.player_list[1], "none");
	if (event.keyCode == 83 && level.player_list.length ==2) level.start_move(level.player_list[1], "none");
	if (event.keyCode == 68 && level.player_list.length ==2) level.start_move(level.player_list[1], "none");
}

window.addEventListener("keydown", keydown_event);
window.addEventListener("keyup", keyup_event);

let state = "menu";

let level = level_load("solo/level1.json");

let view = function() {
	console.log("Displaying the level");
	draw_canva(level.map);
}

setInterval(view,15);

//main_screen();
