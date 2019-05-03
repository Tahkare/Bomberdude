// Fonction qui prend un nom de fichier en argument et renvoie le niveau chargé
let level_load = function(filename) {
	// On charge le fichier et on le lit
	let file = new XMLHttpRequest();
	file.open("GET", filename, false);
	file.send(null);
	let level = JSON.parse(file.responseText);
	// On crée le niveau
	let result_level = new Level(level.score, level.timer, level.kill_all, level.destroy_all, level.is_multi);
	
	// On parcourt la représentation du niveau pour créer les entités
	let map = [];
	let player_list = [];
	let nb_foes = 0;
	let nb_blocks = 0;
	let exit_list = [];
	for (i=0; i<level.level.length;i++) {
		let sub_map = [];
		for (j=0; j<level.level[i].length;j++) {
			let sub_sub_map = [];
			// On définit les coordonnées de l'entité
			let x = j + 0.5;
			let y = i + 0.5;
			if (level.level[i][j] == "=" || level.level[i][j] == "|" || level.level[i][j] == "+") {
				let wall = new Wall(x,y,result_level);
				sub_sub_map[0] = wall;
			} else if (level.level[i][j] == "P") {
				let player = new Player(x,y,result_level);
				player_list[player_list.length] = player;
				sub_sub_map[0] = player;
			} else if (level.level[i][j] == "M") {
				let foe = new Foe(x,y,result_level);
				nb_foes += 1;
				sub_sub_map[0] = foe;
			} else if (level.level[i][j] == "-") {
				let block = new DestructibleWall(x,y,result_level);
				nb_blocks += 1;
				sub_sub_map[0] = block;
			} else if (level.level[i][j] == "E") {
				let exit = new Exit(x,y,result_level);
				sub_sub_map[0] = exit;
				exit_list[exit_list.length] = exit;
			}
			sub_map[j] = sub_sub_map;
		}
		map[i] = sub_map;
	}
	// On donne les infos au niveau
	result_level.set_map(map);
	result_level.set_values(player_list, exit_list, nb_foes, nb_blocks);
	// On le renvoie
	return result_level;
}
