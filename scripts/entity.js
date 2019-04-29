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
    // When it should be destroyed, we remove it from the map and the list of destructible walls
    onDestroy() {
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
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
        this.player = player;
    }
    // methods
    // Animated every 20 loops
    // explodes after 120 loops (2 seconds)
    update() {
		this.frame_counter = (this.frame_counter + 1) % 20;
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
		
		// We create 5 explosion entities on the 5 tiles where the explosion can have an effect
		let explosion_1 = new Explosion(this.x,this.y,this.level);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(0,0,explosion_1);
		this.level.explosion_list.push(explosion_1);
		let explosion_2 = new Explosion(this.x+1,this.y,this.level);
		this.level.map[parseInt(this.y)][parseInt(this.x)+1].splice(0,0,explosion_2);
		this.level.explosion_list.push(explosion_2);
		let explosion_3 = new Explosion(this.x-1,this.y,this.level);
		this.level.map[parseInt(this.y)][parseInt(this.x)-1].splice(0,0,explosion_3);
		this.level.explosion_list.push(explosion_3);
		let explosion_4 = new Explosion(this.x,this.y+1,this.level);
		this.level.map[parseInt(this.y)+1][parseInt(this.x)].splice(0,0,explosion_4);
		this.level.explosion_list.push(explosion_4);
		let explosion_5 = new Explosion(this.x,this.y-1,this.level);
		this.level.map[parseInt(this.y)-1][parseInt(this.x)].splice(0,0,explosion_5);
		this.level.explosion_list.push(explosion_5);
	}
}


class Explosion extends Entity {
	/* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
        for (let i=0;i<this.level.map[parseInt(this.y)][parseInt(this.x)].length;i++) {
			let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
			if (i != pos) {
				this.level.map[parseInt(this.y)][parseInt(this.x)][i].onDestroy();
			}
		}
    }
	
	//last for 1/6 seconds
    update() {
		this.frame_counter += 1
		if (this.frame_counter == 10) {
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
                    if (this.y % 1 <= 0.5 && this.level.map[parseInt(this.y)-1][parseInt(this.x)].length > 0 && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Player) {
						return false;
					}
					if (this.x % 1 >= 0.7 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Player) {
						return false;
					}
					if (this.x % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Player) {
						return false;
					}
					this.y -= 0.04;
                    if (this.y % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)+1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)+1][parseInt(this.x)].splice(pos,1);			
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "DOWN" :
                    if (this.y % 1 >= 0.5 && this.level.map[parseInt(this.y)+1][parseInt(this.x)].length > 0 && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Player) {
						return false;
					}
					if (this.x % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player) {
						return false;
					}
					if (this.x % 1 <= 0.3 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player) {
						return false;
					}
					this.y += 0.04;
                    if (this.y % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)-1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)-1][parseInt(this.x)].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "LEFT" :
                    if (this.x % 1 <= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Player) {
						return false;
					}
					if (this.y % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Player) {
						return false;
					}
					if (this.y % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Player) {
						return false;
					}
                    this.x -= 0.04;
                    if (this.x % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)+1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)+1].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						
					}
                    break;
                case "RIGHT" :
                    if (this.x % 1 >= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Player) {
						return false;
					}
					if (this.y % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)]+1[parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player) {
						return false;
					}
					if (this.y % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Player) {
						return false;
					}
                    this.x += 0.04;
                    if (this.x % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)-1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)-1].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						
					}
                    break;
                case "NONE" :
                    console.log("MovingEntity.onMove, called with NONE direction && isMoving == true");
                    return false;
                    break;
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
		let not_blocked = this.move();
		// TODO -> DEFINE DIRECTION
		if(!not_blocked){

			let rng = Math.floor(Math.random() * 3);
			switch (this.direction){
				case "UP"    :
					switch (rng){
						case 0 :
							this.direction = "RIGHT";
							break;
						case 1 :
							this.direction = "DOWN";
							break;
						case 2 :
							this.direction = "LEFT";
							break;
					}
					break;
				case "DOWN"  :
					switch (rng){
						case 0 :
							this.direction = "UP";
							break;
						case 1 :
							this.direction = "RIGHT";
							break;
						case 2 :
							this.direction = "LEFT";
							break;
					}
					break;
				case "LEFT"  :
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
					}
					break;
				case "RIGHT" :
					switch (rng){
						case 0 :
							this.direction = "UP";
							break;
						case 1 :
							this.direction = "LEFT";
							break;
						case 2 :
							this.direction = "DOWN";
							break;
					}
					break;
				case "NONE"  :
					console.log("a foe got blocked with diretion of NONE, shouldn't happen");
					break;
			}
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
