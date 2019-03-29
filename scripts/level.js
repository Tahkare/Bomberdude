class Level {

	/* map --> 2D array representing the level
	 * score --> Minimum score to reach to win
	 * timer --> Maximum time to finish the level
	 * kill_all --> Do all the mobs need to be killed to win
	 * destroy_all --> Do all the blocks need to be destroyed to win
	 * is_multi --> Is the map a solo or a multi map
	 * 
	 * has_exited --> The player has found the exit
	 * current_score --> The score currently obtained by the player
	 * 
	 */
	constructor(map, score, timer, kill_all, destroy_all, is_multi, player_list, foe_list, block_list) {
		Object.defineProperty(this, "map", {value : map, writable : true});
		Object.defineProperty(this, "score", {value : score, writable : false});
		Object.defineProperty(this, "current_score", {value : 0, writable : true});
		Object.defineProperty(this, "timer", {value : timer, writable : true});
		Object.defineProperty(this, "kill_all", {value : kill_all, writable : false});
		Object.defineProperty(this, "destroy_all", {value : destroy_all, writable : false});
		Object.defineProperty(this, "is_multi", {value : is_multi, writable : false});
		Object.defineProperty(this, "has_exited", {value : false, writable : true});
		Object.defineProperty(this, "current_score", {value : 0, writable : true});
		Object.defineProperty(this, "player_list", {value : player_list, writable : false});
		Object.defineProperty(this, "foe_list", {value : foe_list, writable : true});
		Object.defineProperty(this, "block_list", {value : block_list, writable : true});
		Object.defineProperty(this, "has_started", {value : false, writable : true});
	}
	
	start() {
		if (!this.has_started) {
			this.has_started = true;
			// DO STUFF
		}
	}
	
	/* Sets the entity direction so that the movement function will know where to move
	 * entity --> the entity to move
	 * direction --> string containing "LEFT","RIGHT","UP","DOWN" or "none"
	 */
	start_move(entity, direction) {
		if (direction == "none") {
			entity.set_moving(false);
		} else {
			entity.set_direction(direction);
			entity.set_moving(true);
		}
		return true;
	}
	
	/* Called when an entity moves to another tile
	 * entity --> the entity to move in the map
	 * direction --> string containing "LEFT","RIGHT","UP","DOWN"
	 */
	apply_move(entity) {
		let x = parseInt(entity.getX());
		let y = parseInt(entity.getY());
		let direction = entity.get_direction();
		let prev_x = x;
		let prev_y = y;
		if (direction == "LEFT") prev_x = x+1;
		if (direction == "RIGHT") prev_x = x-1;
		if (direction == "UP") prev_y = y+1;
		if (direction == "DOWN") prev_y = y-1;
		let pos = map[prev_x][prev_y].indexOf(entity);
		map[prev_x][prev_y].splice(pos,pos);
		map[x][y].push(entity);
	}
	
	
	
}
