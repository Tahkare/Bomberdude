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
	if (event.keyCode >= 37 && event.keyCode <= 40) level.start_move(level.player_list[0], "NONE");
	if (event.keyCode == 90 && level.player_list.length ==2) level.start_move(level.player_list[1], "NONE");
	if (event.keyCode == 81 && level.player_list.length ==2) level.start_move(level.player_list[1], "NONE");
	if (event.keyCode == 83 && level.player_list.length ==2) level.start_move(level.player_list[1], "NONE");
	if (event.keyCode == 68 && level.player_list.length ==2) level.start_move(level.player_list[1], "NONE");
}

let click_event = function(event) {
	console.log(event);
	if (current_level == 0) {
		if (event.screenX >= 300 && event.screenX <= 500 && event.screenY >= 200 && event.screenY <= 290) {
			window.addEventListener("keydown", keydown_event);
			window.addEventListener("keyup", keyup_event);
			level = level_load("solo/level1.json");
			current_level = 1;
			interval = setInterval(view,15);
		}
		if (event.screenX >= 300 && event.screenX <= 500 && event.screenY >= 350 && event.screenY <= 290) {
			window.addEventListener("keydown", keydown_event);
			window.addEventListener("keyup", keyup_event);
			level = level_load("multi/level_multi.json");
			current_level = -1;
			interval = setInterval(view,15);
		}
	}
}

let view = function() {
	console.log("Displaying the level");
	draw_canva(level.map);
}

let end_level = function(has_won) {
	if (current_level < 0 || current_level == 5) {
		clearInterval(interval);
		window.removeEventListener("keydown",keydown_event);
		window.removeEventListener("keyup",keyup_event);
		current_level = 0;
		main_screen();
	} else {
		current_level += 1;
		clearInterval(interval);
		level = level_load("solo/level"+current_level+".json");
		interval = setInterval(view,15);
	}
}

let interval;
let current_level = 0;
let level;
main_screen();
window.addEventListener("click", click_event);

