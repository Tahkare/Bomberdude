/*
 * Entity is an "abstract class"
 *  it represent every object inside a level of the bomberman :
 *  walls / destructible walls / foes / players / bombs
 *  Contains the common informations of every entities :
 *  attributes :
 *      x : the column index in the level map
 *      y : the row index in the level map
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
    update(){};
    onDestroy(){};
}

/*
 * Used for level's border walls && unbreakable walls
 * Also mother of DestructibleWall
 */
class Wall extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
}

/*
 * Used for DestructibleWalls inside level
 * can be destroy
 */
class DestructibleWall extends Wall{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
    //methods
    onDestroy() {
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.block_list.indexOf(this);
		this.level.block_list.splice(pos,1);
	}
}

/*
 * Used for Bombs inside level
 * can be destroy
 */
class Bomb extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level,player){
        super(x,y,level);
        this.player = player;
    }
    //methods
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
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		pos = this.level.bomb_list.indexOf(this);
		this.level.bomb_list.splice(pos,1);
		this.player.bomb_count -= 1;
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
                    this.y -= 0.04;
                    if (this.y % 1 <= 0.5 && this.level.map[parseInt(this.y)-1][parseInt(this.x)].length > 0 && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Foe) {
						this.y += 0.04;
						return false;
					}
					if (this.x % 1 >= 0.8 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe) {
						this.y += 0.04;
						return false;
					}
					if (this.x % 1 <= 0.2 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe) {
						this.y += 0.04;
						return false;
					}
                    if (this.y % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)+1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)+1][parseInt(this.x)].splice(pos,1);			
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "DOWN" :
                    this.y += 0.04;
                    if (this.y % 1 >= 0.5 && this.level.map[parseInt(this.y)+1][parseInt(this.x)].length > 0 && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Foe) {
						this.y -= 0.04;
						return false;
					}
					if (this.x % 1 >= 0.8 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Foe) {
						this.y -= 0.04;
						return false;
					}
					if (this.x % 1 <= 0.2 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe) {
						this.y -= 0.04;
						return false;
					}
                    if (this.y % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)-1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)-1][parseInt(this.x)].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "LEFT" :
                    this.x -= 0.04;
                    if (this.x % 1 <= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Foe) {
						this.x += 0.04;
						return false;
					}
					if (this.y % 1 >= 0.8 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe) {
						this.x += 0.04;
						return false;
					}
					if (this.y % 1 <= 0.2 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe) {
						this.x += 0.04;
						return false;
					}
                    if (this.x % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)+1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)+1].splice(pos,1);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						
					}
                    break;
                case "RIGHT" :
                    this.x += 0.04;
                    if (this.x % 1 >= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Foe) {
						this.x -= 0.04;
						return false;
					}
					if (this.y % 1 >= 0.8 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)]+1[parseInt(this.x)+1][0].constructor != Foe) {
						this.x -= 0.04;
						return false;
					}
					if (this.y % 1 <= 0.2 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe) {
						this.x -= 0.04;
						return false;
					}
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
 * added attribute :
 *  - HP : the number of time, a player can be hit
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
    }
    //methods
    
    update() {
		this.frame_counter = (this.frame_counter + 1) % 10;
		if (this.frame_counter == 0) {
			this.frame = (this.frame + 1) % 4;
		}
		this.move();
		// TODO -> DEFINE DIRECTION
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
