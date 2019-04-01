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
    constructor(x, y){
        Object.defineProperty(this, "x", {value : x , writable : true});
        Object.defineProperty(this, "y", {value : y , writable : true});
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
    constructor(x, y){
        super(x,y);
    }
    //methods (Wall got no methods)
}

/*
 * Used for DestructibleWalls inside level
 * can be destroy
 */
class DestructibleWall extends Wall{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
    }
    //methods
}

/*
 * Used for Bombs inside level
 * can be destroy
 */
class Bomb extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        Object.defineProperty(this, "timer", {value : 2000 /*ms*/ , writable : true});
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
    constructor(x, y){
        super(x,y);
        Object.defineProperty(this, "direction", {value : "NONE" , writable : true });
        Object.defineProperty(this, "isMoving", {value : false , writable : true });
    }
    //methods

    /*
     * Shouldn't be used alone.
     * Work more like a callback function.
     * Should be called every time a moving entity move.
     */
    onMove(){
        switch (this.direction){
            case "UP" :
                this.y -= 1;
                break;
            case "DOWN" :
                this.y += 1;
                break;
            case "LEFT" :
                this.x += 1;
                break;
            case "RIGHT" :
                this.x -= 1;
                break;
            case "NONE" :
                console.log("MovingEntity.onMove, called with NONE direction");
                break;
        }
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
    constructor(x, y){
        super(x,y);
        Object.defineProperty(this, "HP", {value : 3, writable : true});
    }
    //methods

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
    constructor(x, y){
        super(x,y);
    }
    //methods
}



class Exit extends Entity {}
