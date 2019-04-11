// Fonction qui prend un nom de fichier en argument et renvoie le niveau chargé
let level_load = function(filename) {
	let file = new XMLHttpRequest();
	file.open("GET", filename, false);
	file.send(null);
	let level = JSON.parse(file.responseText);
	let map = [];
	let player_list = [];
	let foe_list = [];
	let block_list = [];
	for (i=0; i<level.level.length;i++) {
		let sub_map = [];
		for (j=0; j<level.level[i].length;j++) {
			let sub_sub_map = [];
			let x = j + 0.5;
			let y = i + 0.5;
			if (level.level[i][j] == "=" || level.level[i][j] == "|" || level.level[i][j] == "+") {
				sub_sub_map[0] = new Wall(x,y);
			} else if (level.level[i][j] == "P") {
				let player = new Player(x,y);
				player_list[player_list.length] = player;
				sub_sub_map[0] = player;
			} else if (level.level[i][j] == "M") {
				let foe = new Foe(x,y);
				foe_list[foe_list.length] = foe;
				sub_sub_map[0] = foe;
			} else if (level.level[i][j] == "-") {
				let block = new DestructibleWall(x,y);
				block_list[block_list.length] = block;
				sub_sub_map[0] = block;
			} else if (level.level[i][j] == "E") {
				sub_sub_map[0] = new Exit(x,y);
			}
			sub_map[j] = sub_sub_map;
		}
		map[i] = sub_map;
	}
	return new Level(map, level.score, level.timer, level.kill_all, level.destroy_all, level.is_multi, player_list, foe_list, block_list);
}