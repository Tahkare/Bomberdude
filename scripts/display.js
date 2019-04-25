let canva = document.getElementById("cvn");
let context = canva.getContext('2d');

let load_images = function() {
	let img_set = { player_up_0 : new Image(), player_up_1 : new Image(), player_up_2 : new Image(),
					player_down_0 : new Image(), player_down_1 : new Image(), player_down_2 : new Image(),
					player_left_0 : new Image(), player_left_1 : new Image(), player_left_2 : new Image(), player_left_3 : new Image(),
					player_right_0 : new Image(), player_right_1 : new Image(), player_right_2 : new Image(), player_right_3 : new Image(),
					
					foe_up_0 : new Image(), foe_up_1 : new Image(), foe_up_2 : new Image(),
					foe_down_0 : new Image(), foe_down_1 : new Image(), foe_down_2 : new Image(),
					foe_left_0 : new Image(), foe_left_1 : new Image(), foe_left_2 : new Image(), foe_left_3 : new Image(),
					foe_right_0 : new Image(), foe_right_1 : new Image(), foe_right_2 : new Image(), foe_right_3 : new Image(),
					
					wall_vertical : new Image(), wall_horizontal : new Image(), wall_destructible : new Image(), ground : new Image(),
					
					bomb_0 : new Image(), bomb_1 : new Image(), bomb_2 : new Image(), 
					bomb_3 : new Image(), bomb_4 : new Image(), bomb_5 : new Image(),
					
					explosion : new Image()
				  };	
	img_set.player_up_0.src = 'images/player_up_0.png';
	img_set.player_up_1.src = 'images/player_up_1.png';
	img_set.player_up_2.src = 'images/player_up_2.png';
	img_set.player_down_0.src = 'images/player_down_0.png';
	img_set.player_down_1.src = 'images/player_down_1.png';
	img_set.player_down_2.src = 'images/player_down_2.png';
	img_set.player_right_0.src = 'images/player_right_0.png';
	img_set.player_right_1.src = 'images/player_right_1.png';
	img_set.player_right_2.src = 'images/player_right_2.png';
	img_set.player_right_3.src = 'images/player_right_3.png';
	img_set.player_left_0.src = 'images/player_left_0.png';
	img_set.player_left_1.src = 'images/player_left_1.png';
	img_set.player_left_2.src = 'images/player_left_2.png';
	img_set.player_left_3.src = 'images/player_left_3.png';
	img_set.foe_up_0.src = 'images/foe_up_0.png';
	img_set.foe_up_1.src = 'images/foe_up_1.png';
	img_set.foe_up_2.src = 'images/foe_up_2.png';
	img_set.foe_down_0.src = 'images/foe_down_0.png';
	img_set.foe_down_1.src = 'images/foe_down_1.png';
	img_set.foe_down_2.src = 'images/foe_down_2.png';
	img_set.foe_right_0.src = 'images/foe_right_0.png';
	img_set.foe_right_1.src = 'images/foe_right_1.png';
	img_set.foe_right_2.src = 'images/foe_right_2.png';
	img_set.foe_right_3.src = 'images/foe_right_3.png';
	img_set.foe_left_0.src = 'images/foe_left_0.png';
	img_set.foe_left_1.src = 'images/foe_left_1.png';
	img_set.foe_left_2.src = 'images/foe_left_2.png';
	img_set.foe_left_3.src = 'images/foe_left_3.png';
	img_set.wall_destructible.src = 'images/wall_destructible.png';
	img_set.wall_vertical.src = 'images/wall_vertical.png';
	img_set.wall_horizontal.src = 'images/wall_horizontal.png';
	img_set.ground.src = 'images/ground.png';
	img_set.bomb_0.src = 'images/bomb_0.png';
	img_set.bomb_1.src = 'images/bomb_1.png';
	img_set.bomb_2.src = 'images/bomb_2.png';
	img_set.bomb_3.src = 'images/bomb_3.png';
	img_set.bomb_4.src = 'images/bomb_4.png';
	img_set.bomb_5.src = 'images/bomb_5.png';
	img_set.explosion.src = 'images/explosion.png';
	return img_set;
}

const image_set = load_images();

let draw_canva = function(map,started) {
	context.clearRect(0, 0, canva.width, canva.height);
	let gapX = canva.width / map[0].length;
	let gapY = canva.height / map.length;
	for (i=0;i<(map.length)+2;i++) {
		for (j=0;j<map[0].length+2;j++) {
			context.drawImage(image_set.ground, i*gapX, j*gapY, gapX+1, gapY+1);
		}
	}
	for (k=0;k<3;k++) {
		for (i=0;i<map.length;i++) {
			for (j=0;j<map[i].length;j++) {
				if (map[i][j].length > k) {
					switch (map[i][j][k].constructor) {
						case Player :
							switch (map[i][j][k].isMoving) {
								case true :
									switch (map[i][j][k].direction) {
										case "UP" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.player_up_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.player_up_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.player_up_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.player_up_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
										case "DOWN" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.player_down_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.player_down_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.player_down_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.player_down_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
										case "LEFT" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.player_left_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.player_left_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.player_left_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.player_left_3, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
										case "RIGHT" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.player_right_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.player_right_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.player_right_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.player_right_3, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
									}
									break;
								case false :
									switch (map[i][j][k].direction) {
										case "UP" :
											context.drawImage(image_set.player_up_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
										case "DOWN" :
											context.drawImage(image_set.player_down_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
										case "LEFT" :
											context.drawImage(image_set.player_left_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
										case "RIGHT" :
											context.drawImage(image_set.player_right_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
									}
									break;
							}
							break;
						case Foe :
							switch (map[i][j][k].isMoving) {
								case true :
									switch (map[i][j][k].direction) {
										case "UP" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.foe_up_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.foe_up_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.foe_up_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.foe_up_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
										case "DOWN" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.foe_down_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.foe_down_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.foe_down_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.foe_down_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
										case "LEFT" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.foe_left_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.foe_left_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.foe_left_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.foe_left_3, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
										case "RIGHT" :
											switch (map[i][j][k].frame) {
												case 0 :
													context.drawImage(image_set.foe_right_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 1 :
													context.drawImage(image_set.foe_right_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 2 :
													context.drawImage(image_set.foe_right_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
												case 3 :
													context.drawImage(image_set.foe_right_3, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
													break;
											}
											break;
									}
									break;
								case false :
									switch (map[i][j][k].direction) {
										case "UP" :
											context.drawImage(image_set.foe_up_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
										case "DOWN" :
											context.drawImage(image_set.foe_down_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
										case "LEFT" :
											context.drawImage(image_set.foe_left_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
										case "RIGHT" :
											context.drawImage(image_set.foe_right_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
											break;
									}
									break;
							}
							break;
						case DestructibleWall :
							context.drawImage(image_set.wall_destructible, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						case Wall :
							if (j==0 || j== map[i].length-1) {
								context.drawImage(image_set.wall_vertical, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} else {
								context.drawImage(image_set.wall_horizontal, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							} 
							break;
						case Bomb :
							switch (map[i][j][k].frame) {
								case 0 :
									context.drawImage(image_set.bomb_0, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
								case 1 :
									context.drawImage(image_set.bomb_1, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
								case 2 :
									context.drawImage(image_set.bomb_2, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
								case 3 :
									context.drawImage(image_set.bomb_3, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
								case 4 :
									context.drawImage(image_set.bomb_4, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
								case 5 :
									context.drawImage(image_set.bomb_5, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							}
							break;
						case Explosion :
							context.drawImage(image_set.explosion, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
							break;
						case Exit :
							if (j==0 && map[i][j+1].length > 0 && map[i][j+1][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_vertical, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							} else if (j == map[i].length-1 && map[i][j-1].length > 0 && map[i][j-1][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_vertical, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							} else if (i == 0 && map[i+1][j].length > 0 && map[i+1][j][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_horizontal, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
									break;
							} else if (i == map.length-1 && map[i-1][j].length > 0 && map[i-1][j][0] instanceof DestructibleWall) {
									context.drawImage(image_set.wall_horizontal, (map[i][j][k].x-0.5)*gapX, (map[i][j][k].y-0.5)*gapY, gapX, gapY);
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
