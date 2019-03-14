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
	constructor(map, score, timer, kill_all, destroy_all, is_multi) {
		Object.defineProperty(this, "map", {value : map, writable : true});
		Object.defineProperty(this, "score", {value : score, writable : false});
		Object.defineProperty(this, "timer", {value : timer, writable : true});
		Object.defineProperty(this, "kill_all", {value : kill_all, writable : false});
		Object.defineProperty(this, "destroy_all", {value : destroyed_all, writable : false});
		Object.defineProperty(this, "is_multi", {value : is_multi, writable : false});
		
		this.has_exited = false;
		this.current_score = 0;
	}
	
	start() {
		
	}
	
	/* Sets the entity direction so that the movement function will know where to move
	 * entity --> the entity to move
	 * direction --> string containing "LEFT","RIGHT","UP","DOWN" or "none"
	 */
	startMove(entity, direction) {
		if (!(direction == "LEFT" && parseInt(entity.getX()) > 0)) {
			return false;
		} else if (!(direction == "RIGHT" && parseInt(entity.getX()) < map.length-1)) {
			return false;
		} else if (!(direction == "UP" && parseInt(entity.getY()) > 0)) {
			return false;
		} else if (!(direction == "DOWN" && parseInt(entity.getY()) < map[0].length-1)) {
			return false;
		} else if (!(direction == "none")) {
			return false;
		}
		entity.setDirection(direction);
		return true;
	}
	
	/* Called when an entity moves to another tile
	 * entity --> the entity to move in the map
	 * direction --> string containing "LEFT","RIGHT","UP","DOWN"
	 */
	applyMove(entity) {
		let x = parseInt(entity.getX());
		let y = parseInt(entity.getY());
		let direction = entity.getDirection();
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
