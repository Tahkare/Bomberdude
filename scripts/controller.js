let keydown_event = function(event) {
	if (event.keyCode == 37) {level.player_list[0].update_move("LEFT");}										// left_arrow pour aller à gauche avec le joueur 1
	if (event.keyCode == 38) {level.player_list[0].update_move("UP");}										// up_arrow pour aller en haut avec le joueur 1
	if (event.keyCode == 39) {level.player_list[0].update_move("RIGHT");}									// right_arrow pour aller à gauche avec le joueur 1
	if (event.keyCode == 40) {level.player_list[0].update_move("DOWN");}										// down_arow pour aller en bas avec le joueur 1
	if (event.keyCode == 90 && level.player_list.length ==2) {level.player_list[1].update_move("UP");}		// z pour aller en haut avec le joueur 2
	if (event.keyCode == 81 && level.player_list.length ==2) {level.player_list[1].update_move("LEFT");}		// q pour aller à gauche avec le joueur 2
	if (event.keyCode == 83 && level.player_list.length ==2) {level.player_list[1].update_move("DOWN");}		// s pour aller en bas avec le joueur 2
	if (event.keyCode == 68 && level.player_list.length ==2) {level.player_list[1].update_move("RIGHT");}	// d pour aller à droite avec le joueur 2
	if (event.keyCode == 80) {level.start();} 																		// p pour démarrer la partie
	if (event.keyCode == 16) {level.player_list[0].drop_bomb();}												// rshift pour poser une bombe avec le joueur 1
	if (event.keyCode == 32 && level.player_list.length ==2) {level.player_list[1].drop_bomb();}				// space pour poser une bombe avec le joueur 2
}

// Quand on relache une touche du clavier, les mouvements sont stoppés
let keyup_event = function(event) {
	if (event.keyCode == 37) {level.player_list[0].update_move("NONE");}
	if (event.keyCode == 38) {level.player_list[0].update_move("NONE");}
	if (event.keyCode == 39) {level.player_list[0].update_move("NONE");}
	if (event.keyCode == 40) {level.player_list[0].update_move("NONE");}
	if (event.keyCode == 90 && level.player_list.length ==2) {level.player_list[1].update_move("NONE");}
	if (event.keyCode == 81 && level.player_list.length ==2) {level.player_list[1].update_move("NONE");}
	if (event.keyCode == 83 && level.player_list.length ==2) {level.player_list[1].update_move("NONE");}
	if (event.keyCode == 68 && level.player_list.length ==2) {level.player_list[1].update_move("NONE");}
}

//Gestion du clic
let click_event = function(event) {
	if (current_level == 0) { // Si on est au menu
		if (event.clientX >= 300 && event.clientX <= 500 && event.clientY >= 200 && event.clientY <= 290) { // Si on clique sur solo
			// On lance le niveau 1
			window.addEventListener("keydown", keydown_event);
			window.addEventListener("keyup", keyup_event);
			level = level_load("solo/level1.json");
			current_level = 1;
			interval = window.setInterval(view,15);
		}
		if (event.clientX >= 300 && event.clientX <= 500 && event.clientY >= 350 && event.clientY <= 440) { // Si on clique sur multi
			// On lance le niveau multi
			window.addEventListener("keydown", keydown_event);
			window.addEventListener("keyup", keyup_event);
			level = level_load("multi/level_multi.json");
			current_level = -1;
			interval = window.setInterval(view,15);
		}
	}
}

// Fonction d'update appelé 60 fois par secondes (mise à jour du moteur + affichage)
let view = function() {
//	console.log("Displaying the level");
	draw_canva(level.map,level.has_started);
	if (level.is_finished && level.has_won) {
		display_win();
	}
	if (level.is_finished && !level.has_won) {
		display_loss();
	}
	level.update_level();
}

// Appelé quand un niveau est fini
let end_level = function(has_won) {
	level.is_finished = true;
	// On met un timeout de 1000 pour que le niveau soit encore animé pendant 1 seconde
	// Ca permet au joueur de voir de quoi il est mort
	setTimeout(() => {
		//On enlève l'affichage des objectifs
		document.getElementById("timer").innerHTML = "";
		document.getElementById("score").innerHTML = "";
		document.getElementById("kill").innerHTML = "";
		document.getElementById("destroy").innerHTML = "";
		// Soit on revient au menu si on a fini ou perdu
		if (current_level < 0 || current_level == 5 || !has_won) {
			clearInterval(interval);
			window.removeEventListener("keydown",keydown_event);
			window.removeEventListener("keyup",keyup_event);
			current_level = 0;
			setTimeout(main_screen,4000);
		} else {
			// Soit on passe au niveau suivant si on a gagné
			current_level += 1;
			clearInterval(interval);
			setTimeout(() => {
							level = level_load("solo/level"+current_level+".json");
							interval = window.setInterval(view,15);
							 }, 4000);
	}},1000);
}

let interval;
// Indique le niveau actuel : 0 -> menu / 1-5 -> solo / -1 -> multi
let current_level = 0;
let level;
// On affiche de base le menu principal
main_screen();
window.addEventListener("click", click_event);

