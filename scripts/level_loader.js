// Fonction qui prend un nom de fichier en argument et renvoie le niveau chargé
let level_load = function(filename) {
	let file = new XMLHttpRequest();
	file.open("GET", filename, false);
	file.send(null);
	let level = JSON.parse(file.responseText);
	let result_level = new Level(level.score, level.timer, level.kill_all, level.destroy_all, level.is_multi);
	let map = [];
	let player_list = [];
	let foe_list = [];
	let block_list = [];
	let wall_list = [];
	for (i=0; i<level.level.length;i++) {
		let sub_map = [];
		for (j=0; j<level.level[i].length;j++) {
			let sub_sub_map = [];
			let x = j + 0.5;
			let y = i + 0.5;
			if (level.level[i][j] == "=" || level.level[i][j] == "|" || level.level[i][j] == "+") {
				let wall = new Wall(x,y,result_level);
				wall_list[wall_list.length] = wall;
				sub_sub_map[0] = wall;
			} else if (level.level[i][j] == "P") {
				let player = new Player(x,y,result_level);
				player_list[player_list.length] = player;
				sub_sub_map[0] = player;
			} else if (level.level[i][j] == "M") {
				let foe = new Foe(x,y,result_level);
				foe_list[foe_list.length] = foe;
				sub_sub_map[0] = foe;
			} else if (level.level[i][j] == "-") {
				let block = new DestructibleWall(x,y,result_level);
				block_list[block_list.length] = block;
				sub_sub_map[0] = block;
			} else if (level.level[i][j] == "E") {
				sub_sub_map[0] = new Exit(x,y,result_level);
			}
			sub_map[j] = sub_sub_map;
		}
		map[i] = sub_map;
	}
	result_level.set_map(map);
	result_level.set_lists(player_list, foe_list, block_list, wall_list);
	return result_level;
}
