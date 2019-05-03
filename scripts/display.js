let canva = document.getElementById("cvn");
let context = canva.getContext('2d');

//Classe abstraite
class Sprite {
	/* Constructor */
	constructor() {
		this.frames = [];
	}
}

//Entités personnages
class MovingSprite extends Sprite {
	/* Constructor */
	constructor(name) {
		super();
		this.directions = ["UP","DOWN","LEFT","RIGHT"];
		// On charge les 4 frames pour les 4 directions
		for (let i=0;i<4;i++) {
			this.frames[this.directions[i]] = [];
			for (let j=0;j<4;j++) {
				this.frames[this.directions[i]][j] = new Image();
				if ((this.directions[i] == "UP" || this.directions[i] == "DOWN") && j >= 2) {
					// Frame 2 -> image 0 and frame 3 -> image 2
					this.frames[this.directions[i]][j].src = "images/" + name + "_" + this.directions[i].toLowerCase() + "_" + ((j-2)*2) + ".png";
				} else {
					this.frames[this.directions[i]][j].src = "images/" + name + "_" + this.directions[i].toLowerCase() + "_" + j + ".png";
				}
			}
		}
	}
}

//Entités d'explosion
class ExplosionSprite extends Sprite {
	/* Constructor */
	constructor(name) {
		super();
		this.positions = ["UP","DOWN","LEFT","RIGHT","CENTER"];
		// On charge 3 images pour le centre et 2 pour le reste
		for (let i=0;i<5;i++) {
			this.frames[this.positions[i]] = [];
			let nb;
			if (i==4) {
				nb = 3;
			} else {
				nb = 2;
			}
			for (let j=0;j<nb;j++) {
				this.frames[this.positions[i]][j] = new Image();
				this.frames[this.positions[i]][j].src = "images/" + name + "_" + this.positions[i].toLowerCase() + "_" + j + ".png";
			}
		}
	}
}

//Entités fixes ou avec animation linéaire (murs, bombes ...)
class AnimatedSprite extends Sprite {
	constructor(name,length) {
		super();
		if (length == 1) {
			this.frames[0] = new Image();
			this.frames[0].src = "images/" + name + ".png";
		} else {
			for (let i=0;i<length;i++) {
				this.frames[i] = new Image();
				this.frames[i].src = "images/" + name + "_" + i + ".png";
			}
		}
	}
}

// On crée un objet qui contient toutes les images du jeu
let load_images = function() {
	return  { 	player : new MovingSprite("player"),
				foe : new MovingSprite("foe"),
				wall_vertical : new AnimatedSprite("wall_vertical",1),
				wall_horizontal : new AnimatedSprite("wall_horizontal",1), 
				wall_destructible : new AnimatedSprite("wall_destructible",1), 
				ground : new AnimatedSprite("ground",1), 
				bomb : new AnimatedSprite("bomb",6),
				explosion : new ExplosionSprite("explosion"),
				powerUp : new AnimatedSprite("powerup", 2)
			};
}

const image_set = load_images();

//Affichage du niveau
let draw_canva = function(map,started) {
	// On efface
	context.clearRect(0, 0, canva.width, canva.height);
	// On calcule la taille d'une case de jeu
	let gapX = canva.width / map[0].length;
	let gapY = canva.height / map.length;
	// On affiche le fond
	for (i=0;i<(map.length)+2;i++) {
		for (j=0;j<map[0].length+2;j++) {
			context.drawImage(image_set.ground.frames[0], i*gapX, j*gapY, gapX+1, gapY+1);
		}
	}
	// Pour chaque entité de la map, on regarde son type puis on affiche l'image adaptée
	for (k=0;k<3;k++) {
		for (i=0;i<map.length;i++) {
			for (j=0;j<map[i].length;j++) {
				if (map[i][j].length > k) {
					switch (map[i][j][k].constructor) {
						// Joueur
						case Player :
							if (map[i][j][k].isMoving) {
									context.drawImage(image_set.player.frames[map[i][j][k].direction][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
									context.drawImage(image_set.player.frames[map[i][j][k].direction][0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							}
							break;
						// Ennemi
						case Foe :
							if (map[i][j][k].isMoving) {
									context.drawImage(image_set.foe.frames[map[i][j][k].direction][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
									context.drawImage(image_set.foe.frames[map[i][j][k].direction][0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							}
							break;
						// Mur destructible
						case DestructibleWall :
							context.drawImage(image_set.wall_destructible.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						// Mur
						case Wall :
							if (j==0 || j== map[i].length-1) {
								context.drawImage(image_set.wall_vertical.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
								context.drawImage(image_set.wall_horizontal.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} 
							break;
						// Bombe
						case Bomb :
							context.drawImage(image_set.bomb.frames[map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						// Explosion
						case Explosion :
							if (map[i][j][k].position == "CENTER") {
								context.drawImage(image_set.explosion.frames["CENTER"][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else if (map[i][j][k].frame_counter > 1 && map[i][j][k].frame_counter < 18) {
								context.drawImage(image_set.explosion.frames[map[i][j][k].position][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							}
							break;
						// PowerUp
						case PowerUp :
							context.drawImage(image_set.powerUp.frames[map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						// Sortie
						case Exit :
							if (j==0 && map[i][j+1].length > 0 && map[i][j+1][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_vertical.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							} else if (j == map[i].length-1 && map[i][j-1].length > 0 && map[i][j-1][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_vertical.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							} else if (i == 0 && map[i+1][j].length > 0 && map[i+1][j][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_horizontal.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							} else if (i == map.length-1 && map[i-1][j].length > 0 && map[i-1][j][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_horizontal.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							}
					}
				}
			}
		}
	}
	// Si le niveau n'a pas encore commencé, on affiche un message pour indique comment le lancer
	if (!started) {
		context.fillStyle = "red";
		context.font = "70px Arial";
		context.fillText("Press P to start the level",400,300);
	}
}

// Texte de défaite
let display_loss = function() {
	context.fillStyle = "red";
	context.font = "70px Arial";
	context.fillText("Defeat :(",400,300);
}

// Texte de victoire
let display_win = function() {
	context.fillStyle = "green";
	context.font = "70px Arial";
	context.fillText("Victory !",400,300);
}

// Menu principal
let main_screen = function() {
	context.fillStyle = "white";
	context.fillRect(0,0,800,600);
	context.fillStyle = "black";
	context.font = "30px Arial";
	context.textAlign = "center";
	context.fillText("BOMBERDUDE", 400, 50);
	context.fillStyle = "red";
	context.fillRect(300,200,200,90);
	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText("SINGLE PLAYER", 400, 250);
	context.fillStyle = "red";
	context.fillRect(300,350,200,90);
	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText("MULTI PLAYER", 400, 400);
}
