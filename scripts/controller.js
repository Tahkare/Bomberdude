let keydown_event = function(event) {
	if (event.keyCode == 37) {level.update_move(level.player_list[0], "LEFT");}
	if (event.keyCode == 38) {level.update_move(level.player_list[0], "UP");}
	if (event.keyCode == 39) {level.update_move(level.player_list[0], "RIGHT");}
	if (event.keyCode == 40) {level.update_move(level.player_list[0], "DOWN");}
	if (event.keyCode == 90 && level.player_list.length ==2) {level.update_move(level.player_list[1], "UP");}
	if (event.keyCode == 81 && level.player_list.length ==2) {level.update_move(level.player_list[1], "LEFT");}
	if (event.keyCode == 83 && level.player_list.length ==2) {level.update_move(level.player_list[1], "DOWN");}
	if (event.keyCode == 68 && level.player_list.length ==2) {level.update_move(level.player_list[1], "RIGHT");}
	if (event.keyCode == 80) {level.start();}
	if (event.keyCode == 16) {level.drop_bomb(level.player_list[0]);}
	if (event.keyCode == 32 && level.player_list.length ==2) {level.drop_bomb(level.player_list[1]);}
}

let keyup_event = function(event) {
	if (event.keyCode == 37) {level.update_move(level.player_list[0], "NONE");}
	if (event.keyCode == 38) {level.update_move(level.player_list[0], "NONE");}
	if (event.keyCode == 39) {level.update_move(level.player_list[0], "NONE");}
	if (event.keyCode == 40) {level.update_move(level.player_list[0], "NONE");}
	if (event.keyCode == 90 && level.player_list.length ==2) {level.update_move(level.player_list[1], "NONE");}
	if (event.keyCode == 81 && level.player_list.length ==2) {level.update_move(level.player_list[1], "NONE");}
	if (event.keyCode == 83 && level.player_list.length ==2) {level.update_move(level.player_list[1], "NONE");}
	if (event.keyCode == 68 && level.player_list.length ==2) {level.update_move(level.player_list[1], "NONE");}
}

let click_event = function(event) {
	if (current_level == 0) {
		if (event.clientX >= 300 && event.clientX <= 500 && event.clientY >= 200 && event.clientY <= 290) {
			window.addEventListener("keydown", keydown_event);
			window.addEventListener("keyup", keyup_event);
			level = level_load("solo/level1.json");
			current_level = 1;
			interval = window.setInterval(view,15);
		}
		if (event.clientX >= 300 && event.clientX <= 500 && event.clientY >= 350 && event.clientY <= 440) {
			window.addEventListener("keydown", keydown_event);
			window.addEventListener("keyup", keyup_event);
			level = level_load("multi/level_multi.json");
			current_level = -1;
			interval = window.setInterval(view,15);
		}
	}
}

let view = function() {
	console.log("Displaying the level");
	draw_canva(level.map,level.has_started);
	window.requestAnimationFrame(function() { level.update_level() });
}

let end_level = function(has_won) {
	if (!has_won) {
		display_loss();
	} else {
		display_win();
	}
	document.getElementById("timer").innerHTML = "";
	document.getElementById("score").innerHTML = "";
	document.getElementById("kill").innerHTML = "";
	document.getElementById("destroy").innerHTML = "";
	if (current_level < 0 || current_level == 5 || !has_won) {
		clearInterval(interval);
		window.removeEventListener("keydown",keydown_event);
		window.removeEventListener("keyup",keyup_event);
		current_level = 0;
		setTimeout(main_screen,4000);
	} else {
		current_level += 1;
		clearInterval(interval);
		setTimeout(() => {
						level = level_load("solo/level"+current_level+".json");
						interval = window.setInterval(view,15);
						 }, 4000);
	}
}

let interval;
let current_level = 0;
let level;
main_screen();
window.addEventListener("click", click_event);

