/*
 * Entity is an "abstract class"
 *  it represent every object inside a level of the bomberman :
 *  walls / destructible walls / foes / players / bombs
 *  Contains the common informations of every entities :
 *  
 */

class Entity {

    //construtors
    constructor(x, y){
        Object.defineProperty(this, "x", {value : x , writable : true});
        Object.defineProperty(this, "y", {value : y , writable : true});
        Object.defineProperty(this, "texture", {value : "empty_texture" , writable : true});
    }
    //methods (entity got no methods)
}

class Wall extends Entity{
    //construtors
    constructor(x, y){
        super(x,y);
        this.texture = "wall_texture";
    }
    //methods
}

class DestructibleWall extends Wall{
    //construtors
    constructor(x, y){
        super(x,y);
        this.texture = "destructible_wall_texture";
    }
    //methods
}

class Bomb extends Entity{
    //construtors
    constructor(x, y){
        super(x,y);
        this.texture = "bomb_texture";
    }
    //methods
}

class MovingEntity extends Entity{
    //constructors
    constructor(x, y){
        super(x,y);
    }

    //methods

}

class Player extends MovingEntity{
    //construtors
    constructor(x, y){
        super(x,y);
        this.texture = "face_player_texture";
    }
    //methods
}

class Foe extends MovingEntity{
    //construtors
    constructor(x, y){
        super(x,y);
        this.texture = "face_foe_texture";
    }
    //methods
}