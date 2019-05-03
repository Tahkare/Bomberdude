class Level {

	constructor(score, timer, kill_all, destroy_all, is_multi) {
		// Tableau 3D qui représente le niveau
		this.map = [];
		
		// Les différents objectifs à atteindre
		this.score = score;			// score à atteindre
		this.current_score = 0;		// score actuel
		this.time = timer;			// temps restant
		this.kill_all = kill_all;	// est-ce qu'on doit tuer tous les ennemis
		this.destroy_all = destroy_all;// est-ce qu'on doit détruire tous les blocs
		this.is_multi = is_multi;	// est-ce que c'est multi-joueur
		
		this.player_list = [];	// liste des joueurs
		this.nb_foes;			// nombre d'ennemis restants
		this.nb_blocks;			// nombre de blocs destructibles restants
		this.exit_list = [];	// liste des sorties
		
		this.has_started = false;	// le niveau a commencé ?
		this.is_finished = false;	// le niveau est fini ?
		this.has_won = false;		// est-ce qu'on a gagné ou perdu
		this.counter = 0;			// compteur pour le timer
		
		// On affiche le timer et le score si c'est un objectif
		document.getElementById("timer").innerHTML = "Timer : "+this.timer;
		if (this.score > 0) {
			document.getElementById("score").innerHTML = "Points to score : "+this.score;
		}
	}
	
	// On définit la map
	set_map(map) {
		this.map = map;
	}
	
	// On définit les joueurs et sorties ainsi que le nombre d'ennemis et de blocs destructibles
	set_values(player_list, exit_list, nb_foes, nb_blocks) {
		this.player_list = player_list;
		this.foe_list = foe_list;
		this.nb_blocks = nb_blocks;
		this.nb_foes = nb_foes;
		if (this.kill_all) {
			document.getElementById("kill").innerHTML = "Foes to kill : "+this.nb_foes;
		}
		if (this.destroy_all) {
			document.getElementById("destroy").innerHTML = "Blocks to destroy : "+this.nb_blocks;
		}
	}
	
	// Fonction qui lance le niveau, appelée par le contrôleur
	start() {
		if (!this.has_started) {
			this.has_started = true;
		}
	}
	
	// FOnction qui teste si les conditions de victoire sont remplies
	is_won() {
		// En multi, on gagne s'il reste un seul joueur
		if (this.is_multi && this.player_list.length == 1) {
			return true;
		}
		// En solo, on regarde toutes les conditions une par une
		let is_won = true;
		// score
		if (this.current_score < this.score) {
			is_won = false;
		}
		// ennemis
		if (this.kill_all && this.nb_foes > 0) {
			is_won = false;
		}
		// blocs
		if (this.destroy_all && this.nb_blocks > 0) {
			is_won = false;
		}
		let is_at_exit = false;
		// être sur une sortie
		for (let i=0; i<this.exit_list.length;i++) {
			if (parseInt(this.player_list[0].x) == parseInt(this.exit_list[i].x) && parseInt(this.player_list[0].y) == parseInt(this.exit_list[i].y)) {
				is_at_exit = true;
			}
		}
		if (!is_at_exit) {
			is_won = false;
		}
		return is_won;
	}
	
	// Fonction qui regarde si on a perdu
	is_lost() {
		return (this.player_list.length == 0 || this.timer <= 0);
	}

	// Fonction de mise à jour du modèle appelée 60 fois par seconde
	update_level(){
		if (this.has_started) {
			// Compteur pour le timer
			this.counter = (this.counter + 1) % 60;
			
			// On met à jour toutes les entités
			for (let i=0; i<this.map.length;i++) {
				for (let j=0; j<this.map[i].length;j++) {
					for (let k=0; k<this.map[i][j].length;k++) {
						this.map[i][j][k].update();
					}
				}
			}

			// Tant que le niveau n'est pas terminé
			// On met à jour les objectifs et on regarde si le niveau est terminé
			if (!this.is_finished) {
				if (this.counter == 0) {
					this.timer -= 1;
					document.getElementById("timer").innerHTML = "Timer : "+this.timer;
				}
			
				if (this.score > 0) {
					document.getElementById("score").innerHTML = "Points to score : "+(this.score - this.current_score);
				}
				if (this.kill_all) {
				document.getElementById("kill").innerHTML = "Foes to kill : "+this.foe_list.length;
				}
				if (this.destroy_all) {
					document.getElementById("destroy").innerHTML = "Blocks to destroy : "+this.foe_list.length;
				}
			
				if (this.is_lost()) {
					end_level(false);
					this.is_finished = true;
				} else if (this.is_won()) {
					end_level(true);
					this.is_finished = true;
					this.has_won = true;
				}
			}
		}
	}
	
}
