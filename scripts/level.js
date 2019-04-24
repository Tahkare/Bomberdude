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
	constructor(score, timer, kill_all, destroy_all, is_multi) {
		Object.defineProperty(this, "map", {value : [], writable : true});
		Object.defineProperty(this, "score", {value : score, writable : false});
		Object.defineProperty(this, "current_score", {value : 0, writable : true});
		Object.defineProperty(this, "timer", {value : timer, writable : true});
		Object.defineProperty(this, "kill_all", {value : kill_all, writable : false});
		Object.defineProperty(this, "destroy_all", {value : destroy_all, writable : false});
		Object.defineProperty(this, "is_multi", {value : is_multi, writable : false});
		Object.defineProperty(this, "has_exited", {value : false, writable : true});
		Object.defineProperty(this, "current_score", {value : 0, writable : true});
		Object.defineProperty(this, "player_list", {value : [], writable : true});
		Object.defineProperty(this, "foe_list", {value : [], writable : true});
		Object.defineProperty(this, "block_list", {value : [], writable : true});
		Object.defineProperty(this, "wall_list", {value : [], writable : true});
		Object.defineProperty(this, "bomb_list", {value : [], writable : true});
		Object.defineProperty(this, "has_started", {value : false, writable : true});
	}
	
	set_map(map) {
		this.map = map;
	}
	
	set_lists(player_list, foe_list, block_list, wall_list) {
		this.player_list = player_list;
		this.foe_list = foe_list;
		this.block_list = block_list;
		this.wall_list = wall_list;
	}
	
	start() {
		if (!this.has_started) {
			this.has_started = true;
			console.log(this)
		}
	}

	update_level(){
		if (this.has_started) {
			for (i=0;i<this.player_list.length;i++) {
				this.player_list[i].update();
			}
		}
	}
	
	/* Sets the entity direction so that the movement function will know where to move
	 * entity --> the entity to move
	 * direction --> string containing "LEFT","RIGHT","UP","DOWN" or "none"
	 */
	update_move(entity, direction) {
		if (this.has_started) {
			if(direction != "LEFT" && direction != "RIGHT" && direction != "DOWN" && direction != "UP" && direction != "NONE"){
				//Should not happen
				console.log("Invalid direction : " + direction);
				return;
			}
			else{
				if(direction === "NONE"){entity.isMoving = false;}
				else{
					entity.direction = direction;
					entity.isMoving = true;
				}
				return;
			}
		}
	}

	drop_bomb(entity){
		let bomb = new Bomb (entity.x, entity.y);
		map[bomb.x][bomb.y].push();
	}
	
}
