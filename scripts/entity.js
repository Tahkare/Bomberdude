/*
 *  Entity is an "abstract class"
 *  it represent every object inside a level of the bomberdude :
 *  walls / destructible walls / foes / players / bombs / explosions / exits
 *  Contains the common information to every entity :
 *  attributes :
 *      x : the column index in the level map
 *      y : the row index in the level map
 * 		level : the level
 */

class Entity {

    /* CONSTRUCTORS */
    constructor(x, y, level){
        this.x = x;
        this.y = y;
        this.level = level;
        this.frame_counter = 0;
        this.frame = 0;
    }
    
    /* METHODS */
    // Called 60 times per second to update the entity 
    update(){};
    // Called when the entity should be destroyed (hit by an explosion for example)
    onDestroy(){};
}

/*
 * Used for the border walls and indestructible walls in the level
 * Also parent of DestructibleWall
 * Entity without anything in particular
 */
class Wall extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
}

/*
 * Used for destructible walls inside the level
 * can be destroyed
 */
class DestructibleWall extends Wall{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
    //methods
    // When it should be destroyed, we remove it from the map and the list of destructible walls, then adding a powerUp if lucky
    onDestroy() {
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		if(Math.random() > 0.6){
			let pUp = new PowerUp(this.x, this.y, this.level)
			this.level.map[parseInt(this.y)][parseInt(this.x)].push(pUp);
			this.level.powerUp_list.push(pUp);
		}
		pos = this.level.block_list.indexOf(this);
		this.level.block_list.splice(pos,1);
	}
}

/*
 * Used for bombs inside the level
 * can be destroyed
 */
class Bomb extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level,player){
		super(x,y,level);
		Object.defineProperty(this, "player", {value : player, writable : false});
		Object.defineProperty(this, "power", {value : player.bombs_power, writable : false});
    }
    // methods
    // Animated every 30 loops
    // explodes after 180 loops (3 seconds)
    update() {
		this.frame_counter = (this.frame_counter + 1) % 30;
		if (this.frame_counter == 0) {
			this.frame += 1;
		}
		if (this.frame == 6) {
			this.onDestroy();
		}
	}
	
	onDestroy() {
		// When it explodes, removed from the map and the list
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.bomb_list.indexOf(this);
		this.level.bomb_list.splice(pos,1);
		
		// The owner's bomb count is reduced by 1
		this.player.bomb_count -= 1;
		
		// We create explosions entities on the center and the four directions where the explosion can have an effect
		let explosion_center = new Explosion(this.x,this.y,"CENTER",this.level);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(0,0,explosion_center);
		this.level.explosion_list.push(explosion_center);
		//for each directions :
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			//if the explosion enounter something else than a Foe or a Player, then stop spreading !(explosion_case[0] instanceof MovingEntity)
			if(this.level.map[parseInt(this.y)][parseInt(this.x)+i].length != 0 && !(this.level.map[parseInt(this.y)][parseInt(this.x)+i][0] instanceof MovingEntity)){ spread = false;}
			let last = false;
			//check if it's the explosion extremity
			if(i == this.power){ last = true;}
			let explosion_RIGHT = new Explosion(this.x+i,this.y,"RIGHT",this.level, last);
			this.level.map[parseInt(this.y)][parseInt(this.x)+i].splice(0,0,explosion_RIGHT);
			this.level.explosion_list.push(explosion_RIGHT);
			if(!spread){break;}
		}
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			if(this.level.map[parseInt(this.y)][parseInt(this.x)-i].length != 0 && !(this.level.map[parseInt(this.y)][parseInt(this.x)-i][0] instanceof MovingEntity)){ spread = false;} 
			let last = false;
			if(i == this.power){ last = true;}
			let explosion_LEFT = new Explosion(this.x-i,this.y,"LEFT",this.level, last);
			this.level.map[parseInt(this.y)][parseInt(this.x)-i].splice(0,0,explosion_LEFT);
			this.level.explosion_list.push(explosion_LEFT);
			if(!spread){break;}
		}
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			if(this.level.map[parseInt(this.y)+i][parseInt(this.x)].length != 0 && !(this.level.map[parseInt(this.y)+i][parseInt(this.x)][0] instanceof MovingEntity)){ spread = false;} 
			let last = false;
			if(i == this.power){ last = true;}
			let explosion_DOWN = new Explosion(this.x,this.y+i,"DOWN",this.level, last);
			this.level.map[parseInt(this.y)+i][parseInt(this.x)].splice(0,0,explosion_DOWN);
			this.level.explosion_list.push(explosion_DOWN);
			if(!spread){break;}
		}
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			if(this.level.map[parseInt(this.y)-i][parseInt(this.x)].length != 0 && !(this.level.map[parseInt(this.y)-i][parseInt(this.x)][0] instanceof MovingEntity)){ spread = false;} 
			let last = false;
			if(i == this.power){ last = true;}
			let explosion_UP = new Explosion(this.x,this.y-i,"UP",this.level, last);
			this.level.map[parseInt(this.y)-i][parseInt(this.x)].splice(0,0,explosion_UP);
			this.level.explosion_list.push(explosion_UP);
			if(!spread){break;}
		}
	}
}

class Explosion extends Entity {
	/* CONSTRUCTORS */
    constructor(x, y, position, level, last){
		super(x,y,level);
		Object.defineProperty(this, "position", {value : position, writable : false});
		if(position != "CENTER" && last){
			this.frame = 1;
		}
    }
	
	//last for 1/6 seconds
    update() {
		for (let i=0;i<this.level.map[parseInt(this.y)][parseInt(this.x)].length;i++) {
			let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
			if (i != pos) {
				this.level.map[parseInt(this.y)][parseInt(this.x)][i].onDestroy();
			}
		}
		
		this.frame_counter += 1
		if (this.position == "CENTER") {
			if (this.frame_counter <= 2) {
				this.frame = this.frame_counter;
			}
			if (this.frame_counter >= 17) {
				this.frame = 19 - this.frame_counter;
			}
		}
		if (this.frame_counter == 20) {
			this.onDestroy();
		}
	}
	
	onDestroy(){
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.explosion_list.indexOf(this);
		this.level.explosion_list.splice(pos,1);
    }
}

class PowerUp extends Entity{
	/* CONSTRUCTORS */
    constructor(x, y, level){
		super(x,y, level);
		let rng = Math.random();
		let type;
		if(rng > 0.3){ type = "powerBombs";}
		else{ type = "moreBombs";}
		Object.defineProperty(this, "type", {value : type, writable : false});
	}

	//methods
	onPickUp(player){
		//effect of the power up on the player
		switch (this.type){
			case "powerBombs" :
				player.bombs_power = player.bombs_power + 1;
				break;
			
			case "moreBombs" :
				player.max_bombs = player.max_bombs + 1;
				break;
		}
		//removing the power up from the game
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.powerUp_list.indexOf(this);
		this.level.powerUp_list.splice(pos,1);
	}

	update(){
		for(let i = 0; i < this.level.map[parseInt(this.y)][parseInt(this.x)].length; i++){
			if(this.level.map[parseInt(this.y)][parseInt(this.x)][i] instanceof Player){
				this.onPickUp(this.level.map[parseInt(this.y)][parseInt(this.x)][i]);
				break;
			}
		}
	}
}

/*
 * Used for every entity able to move
 * This class is an abstract class and shouldn't be instanciate.
 *  Got the attribute : 
 *      - direction, which represent the way the entity is looking
 *      - isMoving, a boolean.
 */
class MovingEntity extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y, level);
        Object.defineProperty(this, "direction", {value : "DOWN" , writable : true });
        Object.defineProperty(this, "isMoving", {value : false , writable : true });
		this.switched = false;
    }
    //methods

    /*
     * Shouldn't be used alone.
     * Work more like a callback function.
     * Should be called every time update function is called.
     */
    move(){
        if(this.isMoving) {
            switch (this.direction){
                case "UP" :
                    if (this.y % 1 <= 0.5 && this.level.map[parseInt(this.y)-1][parseInt(this.x)].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.x % 1 >= 0.7 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.x % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
					this.y -= 0.04;
                    if (this.y % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)+1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)+1][parseInt(this.x)].splice(pos,1);			
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						this.switched = true;
					}
                    break;
                case "DOWN" :
                    if (this.y % 1 >= 0.5 && this.level.map[parseInt(this.y)+1][parseInt(this.x)].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.x % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.x % 1 <= 0.3 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
					this.y += 0.04;
                    if (this.y % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)-1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)-1][parseInt(this.x)].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						this.switched = true;
					}
                    break;
                case "LEFT" :
                    if (this.x % 1 <= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.y % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.y % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
                    this.x -= 0.04;
                    if (this.x % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)+1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)+1].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						this.switched = true;
						
					}
                    break;
                case "RIGHT" :
                    if (this.x % 1 >= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.y % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.y % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
                    this.x += 0.04;
                    if (this.x % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)-1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)-1].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						this.switched = true;
					}
                    break;
                case "NONE" :
                    console.log("MovingEntity.onMove, called with NONE direction && isMoving == true");
                    return false;
            }
        } else {
			this.frame = 0;
			this.frame_counter = 0;
		}
        return true;
    }
}

/*
 * Used only for players Entity
 * added attribute : bomb_count the number of bomb a player have pose on the level
 * 
 */
class Player extends MovingEntity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
		Object.defineProperty(this, "bomb_count", {value : 0, writable : true});
		Object.defineProperty(this, "max_bombs", {value : 1, writable : true});
		Object.defineProperty(this, "bombs_power", {value : 1, writable : true});
    }
    
    //methods
	
	update() {
		this.frame_counter = (this.frame_counter + 1) % 10;
		if (this.frame_counter == 0) {
			this.frame = (this.frame + 1) % 4;
		}
		this.move();
		for (let i=0; i<this.level.map[parseInt(this.y)][parseInt(this.x)].length;i++) {
			if (this.level.map[parseInt(this.y)][parseInt(this.x)][i].constructor == Foe) {
				this.onDestroy();
			}
		}
	}
	
    /* Used when the player is hit
    */
    onDestroy(){
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.player_list.indexOf(this);
		this.level.player_list.splice(pos,1);
    }
}

/*
 * Used only for Foes Entity
 */
class Foe extends MovingEntity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
		super(x,y, level);
		this.isMoving = true;
		let rng = Math.floor(Math.random() * 4);
			switch (rng){
				case 0 :
					this.direction = "UP";
					break;
				case 1 :
					this.direction = "RIGHT";
					break;
				case 2 :
					this.direction = "DOWN";
					break;
				case 3 :
					this.direction = "LEFT";
					break;
			}
    }
    //methods
    
    update() {
		this.frame_counter = (this.frame_counter + 1) % 10;
		//every 1/6 secondes, animate the foe
		if (this.frame_counter == 0) {
			this.frame = (this.frame + 1) % 4;
		}
		this.switched = false;
		let not_blocked = this.move();
		if(!not_blocked || (this.switched && Math.random() < 0.1)){
			let directions = [];
			if (this.level.map[parseInt(this.y)-1][parseInt(this.x)].length == 0 || this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor == Foe || this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor == Player || this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor == Explosion) {
				directions[directions.length] = "UP";
			}
			if (this.level.map[parseInt(this.y)+1][parseInt(this.x)].length == 0 || this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor == Foe || this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor == Player || this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor == Explosion) {
				directions[directions.length] = "DOWN";
			}
			if (this.level.map[parseInt(this.y)][parseInt(this.x)-1].length == 0 || this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor == Foe || this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor == Player || this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor == Explosion) {
				directions[directions.length] = "LEFT";
			}
			if (this.level.map[parseInt(this.y)][parseInt(this.x)+1].length == 0 || this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor == Foe || this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor == Player || this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor == Explosion) {
				directions[directions.length] = "RIGHT";
			}
			
			let rng = Math.floor(Math.random() * directions.length);
			this.direction = directions[rng];
			
		}
	}
	
	onDestroy(){
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.foe_list.indexOf(this);
		this.level.foe_list.splice(pos,1);
    }
    
}



class Exit extends Entity {
	/* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
}
