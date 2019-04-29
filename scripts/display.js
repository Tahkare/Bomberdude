let canva = document.getElementById("cvn");
let context = canva.getContext('2d');

//Abstract class, mother of other Sprite type
class Sprite {
	/* Constructor */
	constructor() {}
}

//For moving entities like player or foe
class MovingSprite extends Sprite {
	/* Constructor */
	constructor(name) {
		super();
		this.frames = [];
		this.directions = ["UP","DOWN","LEFT","RIGHT"];
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

//For explosion entities
class ExplosionSprite extends Sprite {
	/* Constructor */
	constructor(name) {
		super();
		this.frames = [];
		this.positions = ["UP","DOWN","LEFT","RIGHT","CENTER"];
		for (let i=0;i<5;i++) {
			this.positions[this.directions[i]] = [];
			let nb = 1;
			if (i==4) {
				nb = 3;
			}
			for (let j=0;j<nb;j++) {
				this.frames[this.directions[i]][j] = new Image();
				this.frames[this.directions[i]][j].src = "images/" + name + "_" + this.positions[i].toLowerCase() + "_" + j + ".png";
			}
		}
	}
}

//For other entities, that don't move, like bombs or walls
class AnimatedSprite extends Sprite {
	constructor(name,length) {
		super();
		this.frames = [];
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


let load_images = function() {
	return  { 	player : new MovingSprite("player"),
				foe : new MovingSprite("foe"),
				wall_vertical : new AnimatedSprite("wall_vertical",1),
				wall_horizontal : new AnimatedSprite("wall_horizontal",1), 
				wall_destructible : new AnimatedSprite("wall_destructible",1), 
				ground : new AnimatedSprite("ground",1), 
				bomb : new AnimatedSprite("bomb",6),
				explosion : new ExplosionSprite("explosion")
			};
}

const image_set = load_images();

//drawing every object inside the canvas
let draw_canva = function(map,started) {
	context.clearRect(0, 0, canva.width, canva.height);
	let gapX = canva.width / map[0].length;
	let gapY = canva.height / map.length;
	for (i=0;i<(map.length)+2;i++) {
		for (j=0;j<map[0].length+2;j++) {
			context.drawImage(image_set.ground.frames[0], i*gapX, j*gapY, gapX+1, gapY+1);
		}
	}
	for (k=0;k<3;k++) {
		for (i=0;i<map.length;i++) {
			for (j=0;j<map[i].length;j++) {
				if (map[i][j].length > k) {
					switch (map[i][j][k].constructor) {
						case Player :
							if (map[i][j][k].isMoving) {
									context.drawImage(image_set.player.frames[map[i][j][k].direction][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
									context.drawImage(image_set.player.frames[map[i][j][k].direction][0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							}
							break;
						case Foe :
							if (map[i][j][k].isMoving) {
									context.drawImage(image_set.foe.frames[map[i][j][k].direction][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
									context.drawImage(image_set.foe.frames[map[i][j][k].direction][0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							}
							break;
						case DestructibleWall :
							context.drawImage(image_set.wall_destructible.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						case Wall :
							if (j==0 || j== map[i].length-1) {
								context.drawImage(image_set.wall_vertical.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
								context.drawImage(image_set.wall_horizontal.frames[0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} 
							break;
						case Bomb :
							context.drawImage(image_set.bomb.frames[map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						case Explosion :
							if (map[i][j][k].position == "CENTER") {
								context.drawImage(image_set.explosion.frames["CENTER"][map[i][j][k].frame], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else if (map[i][j][k].frame_counter > 1 && map[i][j][k].frame_counter < 8) {
								context.drawImage(image_set.explosion.frames[map[i][j][k].position][0], (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							}
							break;
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
	if (!started) {
		context.fillStyle = "red";
		context.font = "70px Arial";
		context.fillText("Press P to start the level",400,300);
	}
}

let display_loss = function() {
	context.fillStyle = "red";
	context.font = "70px Arial";
	context.fillText("Defeat :(",400,300);
}

let display_win = function() {
	context.fillStyle = "green";
	context.font = "70px Arial";
	context.fillText("Victory !",400,300);
}

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
