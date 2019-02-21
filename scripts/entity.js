/*
 * Entity is an "abstract class"
 *  it represent every object inside a level of the bomberman :
 *  walls / destructible walls / foes / players / bombs
 *  Contains the common informations of every entities :
 *  attributes :
 *      x : the row index in the level.Map
 *      y : he column index in the levelMap
 *      texture : by default the ground texture, changed in each daughter class.
 */

class Entity {

    /* CONSTRUCTORS */
    constructor(x, y){
        Object.defineProperty(this, "x", {value : x , writable : true});
        Object.defineProperty(this, "y", {value : y , writable : true});
        Object.defineProperty(this, "texture", {value : "ground_texture" , writable : true});
    }
    /* METHODS */ 

    //
    onDestroy(){};
}

/*
 * Used for level's border walls && unbreakable walls
 * Also mother of DestructibleWall
 * different texture from Entity
 */
class Wall extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        this.texture = "wall_texture";
    }
    //methods (Wall got no methods)
}

/*
 * Used for DestructibleWalls inside level
 * got different texture from Wall
 * can be destroy
 */
class DestructibleWall extends Wall{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        this.texture = "destructible_wall_texture";
    }
    //methods
}

/*
 * Used for Bombs inside level
 * got different texture from Entity
 * can be destroy
 * 
 */
class Bomb extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        this.texture = "bomb_texture";
    }
    //methods
}

/*
 *
 *
 * 
 * 
 */
class MovingEntity extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        Object.defineProperty(this, "direction", {value : "none" , writable : true, 
                              get : () => {return this.direction},
                              set : (s) => {this.direction = s} });
    }
    //methods
}

/*
 *
 *
 * 
 * 
 */
class Player extends MovingEntity{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        this.texture = "face_player_texture";
    }
    //methods
}

/*
 *
 *
 * 
 * 
 */
class Foe extends MovingEntity{
    /* CONSTRUCTORS */
    constructor(x, y){
        super(x,y);
        this.texture = "face_foe_texture";
    }
    //methods
}