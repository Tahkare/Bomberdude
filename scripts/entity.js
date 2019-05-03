/*
 *  Entity est une classe abstraite
 *  elle représente tous les éléments dans un niveau de bomberdude
 *  walls / destructible walls / foes / players / bombs / explosions / exits
 *  Elle contient 5 attributs :
 *	x,y : position de l'entité
 *  level : le niveau
 *  frame_counter,frame : utilisés pour l'animation
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
    // Appelé pour mettre à jour l'entité
    update(){};
    // Appelé quand l'entité doit être détruite
    onDestroy(){};
}

/*
 * Représente les murs indestructibles du niveau
 * Aucune particularité
 */
class Wall extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
}

/*
 * Utilisé pour les murs destructibles
 * On a donc une fonction onDestroy
 */
class DestructibleWall extends Wall{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
    /* METHODS */
    // Quand on le détruit, on le retire de la map et on a 40% de chance de mettre un powerUp à la place
    onDestroy() {
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		if(Math.random() > 0.6){
			let pUp = new PowerUp(this.x, this.y, this.level)
			this.level.map[parseInt(this.y)][parseInt(this.x)].push(pUp);
		}
		this.level.nb_blocks -= 1;
		this.level.current_score += 10;
	}
}

/*
 * Utilisé pour les bombes
 * Détruites à leur explosion
 */
class Bomb extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level,player){
		super(x,y,level);
		// On définit le propriétaire et la puissance de la bombe à sa création
		this.player = player;
		this.power = player.bombs_power;
    }
    /* METHODS */
    // Animé toutes les 30 updates
    // Explose en 180 updates (environ 3 secondes)
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
		// Quand ça explose, on le retire
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		
		// On décrémente le nombre de bombes du propriétaire
		this.player.bomb_count -= 1;
		
		// On crée les explosions de la bombe
		let explosion_center = new Explosion(this.x,this.y,"CENTER",this.level);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(0,0,explosion_center);
		//On fait ça pour chacune des 4 directions
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			// Si on rencontre autre chose qu'un personnage ou un powerUp, on arrête la propagation
			if(this.level.map[parseInt(this.y)][parseInt(this.x)+i].length != 0 && !(this.level.map[parseInt(this.y)][parseInt(this.x)+i][0] instanceof MovingEntity || this.level.map[parseInt(this.y)][parseInt(this.x)+i][0] instanceof PowerUp)){ spread = false;}
			let last = false;
			// On regarde si on est à l'extrémité de l'explosion (pour l'affichage)
			if(i == this.power){ last = true;}
			// On crée l'explosion et on l'insère
			let explosion_RIGHT = new Explosion(this.x+i,this.y,"RIGHT",this.level, last);
			this.level.map[parseInt(this.y)][parseInt(this.x)+i].splice(0,0,explosion_RIGHT);
			if(!spread){break;}
		}
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			if(this.level.map[parseInt(this.y)][parseInt(this.x)-i].length != 0 && !(this.level.map[parseInt(this.y)][parseInt(this.x)-i][0] instanceof MovingEntity || this.level.map[parseInt(this.y)][parseInt(this.x)+i][0] instanceof PowerUp)){ spread = false;} 
			let last = false;
			if(i == this.power){ last = true;}
			let explosion_LEFT = new Explosion(this.x-i,this.y,"LEFT",this.level, last);
			this.level.map[parseInt(this.y)][parseInt(this.x)-i].splice(0,0,explosion_LEFT);
			if(!spread){break;}
		}
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			if(this.level.map[parseInt(this.y)+i][parseInt(this.x)].length != 0 && !(this.level.map[parseInt(this.y)+i][parseInt(this.x)][0] instanceof MovingEntity || this.level.map[parseInt(this.y)][parseInt(this.x)+i][0] instanceof PowerUp)){ spread = false;} 
			let last = false;
			if(i == this.power){ last = true;}
			let explosion_DOWN = new Explosion(this.x,this.y+i,"DOWN",this.level, last);
			this.level.map[parseInt(this.y)+i][parseInt(this.x)].splice(0,0,explosion_DOWN);
			if(!spread){break;}
		}
		for(let i = 1; i < this.power + 1 ; i++){
			let spread = true;
			if(this.level.map[parseInt(this.y)-i][parseInt(this.x)].length != 0 && !(this.level.map[parseInt(this.y)-i][parseInt(this.x)][0] instanceof MovingEntity || this.level.map[parseInt(this.y)][parseInt(this.x)+i][0] instanceof PowerUp)){ spread = false;} 
			let last = false;
			if(i == this.power){ last = true;}
			let explosion_UP = new Explosion(this.x,this.y-i,"UP",this.level, last);
			this.level.map[parseInt(this.y)-i][parseInt(this.x)].splice(0,0,explosion_UP);
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
	
	// Dure 1/3 de seconde
    update() {
		// A chaque mise à jour, on appelle la fonction de destruction de toutes les entités sur la case
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
		// On finit par détruire notre entité explosion
		if (this.frame_counter == 20) {
			this.onDestroy();
		}
	}
	
	onDestroy(){
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
    }
}

class PowerUp extends Entity{
	/* CONSTRUCTORS */
    constructor(x, y, level){
		super(x,y, level);
		let rng = Math.random();
		if(rng > 0.6){ 
			this.type = "powerBombs";
			this.frame = 1;
		} else { 
			this.type = "moreBombs";
		}
	}

	/* METHODS */
	onPickUp(player){
		//Quand le powerUp est ramassé, on applique son effet au joueur
		switch (this.type){
			case "powerBombs" :
				player.bombs_power = player.bombs_power + 1;
				break;
			
			case "moreBombs" :
				player.max_bombs = player.max_bombs + 1;
				break;
		}
		// On le retire du jeu
		// Il n'y a pas de fonction onDestroy pour le rendre invulnérable aux explosions
		let pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
		this.level.map[parseInt(this.y)][parseInt(this.x)].splice(pos,1);
		this.level.current_score += 20;
	}

	update(){
		// Dans la mise à jour, on regarde si un joueur est sur la case pour ramasser le powerUp
		for(let i = 0; i < this.level.map[parseInt(this.y)][parseInt(this.x)].length; i++){
			if(this.level.map[parseInt(this.y)][parseInt(this.x)][i] instanceof Player){
				this.onPickUp(this.level.map[parseInt(this.y)][parseInt(this.x)][i]);
				break;
			}
		}
	}
}

/*
 * Classe mère des joueurs et ennemis
 * Classe abstraite qui contient la direction de l'entité et si elle se déplace
 * switched est mis à true si pendant un déplacement, on franchit le milieu d'une case. Utilisé pour le changement de direction des monstres
 */
class MovingEntity extends Entity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y, level);
        this.direction = "DOWN";
		this.isMoving = false;
		this.switched = false;
    }
    //methods

    /*
     * Appelé par la fonction update des personnages
     */
    move(){
		// Si on se déplace
        if(this.isMoving) {
			// On regarde pour la direction du personnage
            switch (this.direction){
                case "UP" :
					// Si on se dirige vers un obstacle, on refuse le mouvement
					if (this.y <= 0.5) {
						return false;
					}
                    if (this.y % 1 <= 0.5 && this.level.map[parseInt(this.y)-1][parseInt(this.x)].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor !=  PowerUp) {
						return false;
					// Si on vient de franchir le milieu, on indique qu'on peut switch de direction
					} else if (this.y % 1 >= 0.46) {
						this.switched = true;
					}
					// Si on est à plus de 70% ou à moins de 30% de la case, on doit regarder la case en diagonale pour voir si c'est un obstacle
					if (this.x % 1 >= 0.7 && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.x % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
					// Si on n'a pas refusé le déplacement, on l'effectue
					this.y -= 0.04;
					// Si on change de case, on met à jour la map
                    if (this.y % 1 >= 0.96) {
						let pos = this.level.map[parseInt(this.y)+1][parseInt(this.x)].indexOf(this);
						this.level.map[parseInt(this.y)+1][parseInt(this.x)].splice(pos,1);			
						this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
					}
                    break;
                case "DOWN" :
					if (this.y >= this.level.map.length + 0.5) {
						return false;
					}
                    if (this.y % 1 >= 0.5 && this.level.map[parseInt(this.y)+1][parseInt(this.x)].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)][0].constructor !=  PowerUp) {
						return false;
					} else if (this.y % 1 <= 0.54) {
						this.switched = true;
					}
					if (this.x % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.x % 1 <= 0.3 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
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
					if (this.x <= 0.5) {
						return false;
					}
                    if (this.x % 1 <= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					} else if (this.x % 1 >= 0.46) {
						this.switched = true;
					}
					if (this.y % 1 >= 0.7 && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)+1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
						return false;
					}
					if (this.y % 1 <= 0.3 && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1].length > 0 && (this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Foe  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor != Player  && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)-1][parseInt(this.x)-1][0].constructor !=  PowerUp) {
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
					if (this.x >= this.level.map[0].length + 0.5) {
						return false;
					}
                    if (this.x % 1 >= 0.5 && this.level.map[parseInt(this.y)][parseInt(this.x)+1].length > 0 && (this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Exit || this.constructor == Foe)  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Foe  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor != Player  && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor !=  Explosion && this.level.map[parseInt(this.y)][parseInt(this.x)+1][0].constructor !=  PowerUp) {
						return false;
					} else if (this.x % 1 <= 0.54) {
						this.switched = true;
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
            }
        } else {
			this.frame = 0;
			this.frame_counter = 0;
		}
        return true;
    }
}

/*
 * Représente un joueur
 * Possède des attributs pour représenter son nombre de bombes actuel et max et la puissance de ses bombes
 */
class Player extends MovingEntity{
    /* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
		this.bomb_count = 0;
		this.max_bombs = 1;
		this.bombs_power = 1;
    }
    
    /* METHODS */
	
	update() {
		// On anime toutes les 10 updates
		this.frame_counter = (this.frame_counter + 1) % 10;
		if (this.frame_counter == 0) {
			this.frame = (this.frame + 1) % 4;
		}
		this.move();
		// Si on a un montre sur notre case, on meurt
		for (let i=0; i<this.level.map[parseInt(this.y)][parseInt(this.x)].length;i++) {
			if (this.level.map[parseInt(this.y)][parseInt(this.x)][i].constructor == Foe) {
				this.onDestroy();
			}
		}
	}
	
	// Fonction de mise à jour du mouvement appelée par le contrôleur
	update_move(direction) {
		if (this.level.has_started) {
			// Soit on dit d'arrêter le déplacement
			if(direction === "NONE"){
				this.isMoving = false;
			} else {
			// Soit on donne une nouvelle direction
				this.direction = direction;
				this.isMoving = true;
			}
		}
	}
	
	// Fonction de pose de bombe appelée par le contrôleur
	drop_bomb(){
		if (this.level.has_started) {
			// Si on peut placer une bombe
			if (this.bomb_count < this.max_bombs) {
				// On la crée et on incrémente le nombre de bombes
				let bomb = new Bomb (parseInt(this.x)+0.5, parseInt(this.y)+0.5, this.level, this);
				this.bomb_count = this.bomb_count + 1;
				// On met la bombe dans la case et on remet le joueur par dessus
				let entity_pos = this.level.map[parseInt(this.y)][parseInt(this.x)].indexOf(this);
				this.level.map[parseInt(this.y)][parseInt(this.x)][entity_pos] = bomb;
				this.level.map[parseInt(this.y)][parseInt(this.x)].push(this);
				console.log("Bomb has been planted");
			}
		}
	}
	
    // Appelé quand un personnage meurt
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
		// On donne une direction de départ aléatoire aux ennemis
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
    
	/* METHODS */
    
    update() {
		this.frame_counter = (this.frame_counter + 1) % 10;
		// On anime toutes les 10 updates
		if (this.frame_counter == 0) {
			this.frame = (this.frame + 1) % 4;
		}
		// On regarde si l'entité arrive à se déplacer
		this.switched = false;
		let not_blocked = this.move();
		if(!not_blocked || (this.switched && Math.random() < 0.01)){
			// Si elle est bloquée ou qu'on vient d'arriver au milieu d'une case et qu'on tire un nombre inférieur à 0.05, on change de direction
			let directions = [];
			if (this.level.map[parseInt(this.y)-1][parseInt(this.x)].length == 0 || this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor == Foe || this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor == Player || this.level.map[parseInt(this.y)-1][parseInt(this.x)][0].constructor == Explosion) {
				directions[directions.length] = "UP";
			}
			directions[directions.length] = "DOWN";
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
		this.level.nb_foes -= 1;
		this.level.current_score += 50;
    }
    
}

// Entité représentant les sorties
class Exit extends Entity {
	/* CONSTRUCTORS */
    constructor(x, y, level){
        super(x,y,level);
    }
}
