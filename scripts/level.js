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
		Object.defineProperty(this, "counter", {value : 0, writable : true});
		Object.defineProperty(this, "timer", {value : timer, writable : true});
		Object.defineProperty(this, "kill_all", {value : kill_all, writable : false});
		Object.defineProperty(this, "destroy_all", {value : destroy_all, writable : false});
		Object.defineProperty(this, "is_multi", {value : is_multi, writable : false});
		
		Object.defineProperty(this, "player_list", {value : [], writable : true});
		Object.defineProperty(this, "foe_list", {value : [], writable : true});
		Object.defineProperty(this, "block_list", {value : [], writable : true});
		Object.defineProperty(this, "exit_list", {value : [], writable : true});
		Object.defineProperty(this, "bomb_list", {value : [], writable : true});
		Object.defineProperty(this, "explosion_list", {value : [], writable : true});
		Object.defineProperty(this, "powerUp_list", {value : [], writable : true});
		
		Object.defineProperty(this, "has_started", {value : false, writable : true});
		this.is_finished = false;
		this.has_won = false;
		document.getElementById("timer").innerHTML = "Timer : "+this.timer;
		if (this.score > 0) {
			document.getElementById("score").innerHTML = "Points to score : "+this.score;
		}
	}
	
	set_map(map) {
		this.map = map;
	}
	
	set_lists(player_list, foe_list, block_list, exit_list) {
		this.player_list = player_list;
		this.foe_list = foe_list;
		this.block_list = block_list;
		this.exit_list = exit_list;
		if (this.kill_all) {
			document.getElementById("kill").innerHTML = "Foes to kill : "+this.foe_list.length;
		}
		if (this.destroy_all) {
			document.getElementById("destroy").innerHTML = "Blocks to destroy : "+this.foe_list.length;
		}
	}
	
	start() {
		if (!this.has_started) {
			this.has_started = true;
			console.log(this)
		}
	}
	
	is_won() {
		if (this.is_multi && this.player_list.length == 1) {
			return true;
		}
		let is_won = true;
		if (this.current_score < this.score) {
			is_won = false;
		}
		if (this.kill_all && this.foe_list.length > 0) {
			is_won = false;
		}
		if (this.destroy_all && this.block_list.length > 0) {
			is_won = false;
		}
		let is_at_exit = false;
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
	
	is_lost() {
		return (this.player_list.length == 0 || this.timer <= 0);
	}

	update_level(){
		if (this.has_started) {
			this.counter = (this.counter + 1) % 60;
			
			for (let i=0;i<this.player_list.length;i++) {
				this.player_list[i].update();
			}
			for (let i=0;i<this.foe_list.length;i++) {
				this.foe_list[i].update();
			}
			for (let i=0;i<this.bomb_list.length;i++) {
				this.bomb_list[i].update();
			}
			for (let i=0;i<this.explosion_list.length;i++) {
				this.explosion_list[i].update();
			}
			for (let i=0;i<this.powerUp_list.length;i++) {
				this.powerUp_list[i].update();
			}

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

	// Créer -> ajouter à la map / à la liste -> linker au joueur
	drop_bomb(entity){
		if (this.has_started) {
			if (entity.bomb_count < entity.max_bombs) {
				let bomb = new Bomb (parseInt(entity.x)+0.5, parseInt(entity.y)+0.5, this, entity);
				entity.bomb_count = entity.bomb_count + 1;
				let entity_pos = this.map[parseInt(bomb.y)][parseInt(bomb.x)].indexOf(entity);
				this.map[parseInt(bomb.y)][parseInt(bomb.x)][entity_pos+1] = entity;
				this.map[parseInt(bomb.y)][parseInt(bomb.x)][entity_pos] = bomb;
				this.bomb_list.push(bomb);
				console.log("Bomb has been planted");
			}
		}
	}
	
}
