/*
 * Entity is an "abstract class"
 *  it represent every object inside a level of the bomberman :
 *  walls / destructible walls / foes / players / bombs
 *  Contains the common informations of every entities :
 *  attributes :
 *      x : the column index in the level.Map
 *      y : he row index in the levelMap
 */

class Entity {

    /* CONSTRUCTORS */
    constructor(x, y, level){
        Object.defineProperty(this, "x", {value : x , writable : true});
        Object.defineProperty(this, "y", {value : y , writable : true});
        Object.defineProperty(this, "level", {value : level , writable : true});
        Object.defineProperty(this, "frame_counter", {value : 0 , writable : true});
        Object.defineProperty(this, "frame", {value : 0 , writable : true});
    }
    /* METHODS */ 
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
    //methods (Wall got no methods)
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
}

/*
 * Used for Bombs inside level
 * can be destroy
 */
class Bomb extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
    //methods
    
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
                    if (this.y % 1 <= 0.5 && this.level.map[parseInt(this.y)-1][parseInt(this.x)].length > 0) {
						this.y += 0.04;
						return false;
					}
					if (this.x % 1 >= 0.8 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0) {
						this.y += 0.04;
						return false;
					}
					if (this.x % 1 <= 0.2 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0) {
						this.y += 0.04;
						return false;
					}
                    if (this.y % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)+1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)+1][parseInt(this.x)] = this.level.map[parseInt(this.y)+1][parseInt(this.x)].splice(pos,pos);			
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "DOWN" :
                    this.y += 0.04;
                    if (this.y % 1 >= 0.5 && this.level.map[parseInt(this.y)+1][parseInt(this.x)].length > 0) {
						this.y -= 0.04;
						return false;
					}
					if (this.x % 1 >= 0.8 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0) {
						this.y -= 0.04;
						return false;
					}
					if (this.x % 1 <= 0.2 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0) {
						this.y -= 0.04;
						return false;
					}
                    if (this.y % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)-1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)-1][parseInt(this.x)] = this.level.map[parseInt(this.y)-1][parseInt(this.x)].splice(pos,pos);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "LEFT" :
                    this.x -= 0.04;
                    if (this.x % 1 <= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)-1].length > 0) {
						this.x += 0.04;
						return false;
					}
					if (this.y % 1 >= 0.8 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0) {
						this.x += 0.04;
						return false;
					}
					if (this.y % 1 <= 0.2 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0) {
						this.x += 0.04;
						return false;
					}
                    if (this.x % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)+1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)+1] = this.level.map[parseInt(this.y)][parseInt(this.x)+1].splice(pos,pos);
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
						
					}
                    break;
                case "RIGHT" :
                    this.x += 0.04;
                    if (this.x % 1 >= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)+1].length > 0) {
						this.x -= 0.04;
						return false;
					}
					if (this.y % 1 >= 0.8 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0) {
						this.x -= 0.04;
						return false;
					}
					if (this.y % 1 <= 0.2 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0) {
						this.x -= 0.04;
						return false;
					}
                    if (this.x % 1 <= 0.04) {
						let pos = this.level.map[parseInt(this.y)][parseInt(this.x)-1].indexOf(this);
						this.level.map[parseInt(this.y)][parseInt(this.x)-1] = this.level.map[parseInt(this.y)][parseInt(this.x)-1].splice(pos,pos);
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
        Object.defineProperty(this, "HP", {value : 3, writable : true});
    }
    
    //methods
	
	update() {
		this.frame_counter = (this.frame_counter + 1) % 10;
		if (this.frame_counter == 0) {
			this.frame = (this.frame + 1) % 3;
		}
		this.move();
	}
	
    /* Used when the player is hit
    * Player lose one life, if this kill him, then he's put back on the starting point
    * return true if the player die, otherwise return false.
    */
    onDestroy(){
        if(this.live > 1){
            this.life -= 1;
            return false;
        }
        else{
            this.x = 1;
            this.y = 1;
            this.direction = "NONE";
            this.isMoving = false;
            this.life = 3;
            return true;
        }
    }
}

/*
 * Used only for Foes Entity
 *
 * 
 * 
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
			this.frame = (this.frame + 1) % 3;
		}
		this.move();
	}
    
}



class Exit extends Entity {}
