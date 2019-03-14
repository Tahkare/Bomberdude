var canva = document.getElementById("cvn");
var context = canva.getContext('2d');

let load_images = function() {
}

var image_set = load_images();

let draw_canva = function(map) {
	context.clearRect(0, 0, canva.width, canva.height);
	let gapX = canva.width / map[0].length;
	let gapY = canva.height / map.length;
	for (i=0;i<map.length;i++) {
		for (j=0;j<map[i].length;j++) {
			for (k=0;k<map[i][j].length;k++) {
				switch (map[i][j][k].constructor) {
					case Player :
						switch (map[i][j][k].isMoving) {
							case true :
								switch (map[i][j][k].direction) {
									case "UP" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.player_up_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.player_up_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.player_up_0, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.player_up_2, j*gapX, i*gapY, gapX, gapY);
										}
									case "DOWN" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.player_down_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.player_down_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.player_down_0, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.player_down_2, j*gapX, i*gapY, gapX, gapY);
										}
									case "LEFT" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.player_left_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.player_left_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.player_left_2, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.player_left_3, j*gapX, i*gapY, gapX, gapY);
										}
									case "RIGHT" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.player_right_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.player_right_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.player_right_2, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.player_right_3, j*gapX, i*gapY, gapX, gapY);
										}
								}
							case false :
								switch (map[i][j][k].direction) {
									case "UP" :
										context.draw_image(image_set.player_up_0, j*gapX, i*gapY, gapX, gapY);
									case "DOWN" :
										context.draw_image(image_set.player_down_0, j*gapX, i*gapY, gapX, gapY);
									case "LEFT" :
										context.draw_image(image_set.player_left_0, j*gapX, i*gapY, gapX, gapY);
									case "RIGHT" :
										context.draw_image(image_set.player_right_0, j*gapX, i*gapY, gapX, gapY);
								}
						}
					case Foe :
						switch (map[i][j][k].isMoving) {
							case true :
								switch (map[i][j][k].direction) {
									case "UP" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.foe_up_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.foe_up_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.foe_up_0, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.foe_up_2, j*gapX, i*gapY, gapX, gapY);
										}
									case "DOWN" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.foe_down_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.foe_down_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.foe_down_0, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.foe_down_2, j*gapX, i*gapY, gapX, gapY);
										}
									case "LEFT" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.foe_left_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.foe_left_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.foe_left_2, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.foe_left_3, j*gapX, i*gapY, gapX, gapY);
										}
									case "RIGHT" :
										switch (map[i][j][k].frame) {
											case 0 :
												context.draw_image(image_set.foe_right_0, j*gapX, i*gapY, gapX, gapY);
											case 1 :
												context.draw_image(image_set.foe_right_1, j*gapX, i*gapY, gapX, gapY);
											case 2 :
												context.draw_image(image_set.foe_right_2, j*gapX, i*gapY, gapX, gapY);
											case 3 :
												context.draw_image(image_set.foe_right_3, j*gapX, i*gapY, gapX, gapY);
										}
								}
							case false :
								switch (map[i][j][k].direction) {
									case "UP" :
										context.draw_image(image_set.foe_up_0, j*gapX, i*gapY, gapX, gapY);
									case "DOWN" :
										context.draw_image(image_set.foe_down_0, j*gapX, i*gapY, gapX, gapY);
									case "LEFT" :
										context.draw_image(image_set.foe_left_0, j*gapX, i*gapY, gapX, gapY);
									case "RIGHT" :
										context.draw_image(image_set.foe_right_0, j*gapX, i*gapY, gapX, gapY);
								}
						}
					case DestructibleWall :
						context.draw_image(image_set.destructible_wall, j*gapX, i*gapY, gapX, gapY);
					case Wall :
						if (j==0 || j== map[0].length-1) {
							context.draw_image(image_set.wall_vertical, j*gapX, i*gapY, gapX, gapY);
						} else {
							context.draw_image(image_set.wall_horizontal, j*gapX, i*gapY, gapX, gapY);
						} 
					case Bomb :
						switch (map[i][j][k].frame) {
							case 0 :
								context.draw_image(image_set.bomb_0, j*gapX, i*gapY, gapX, gapY);
							case 1 :
								context.draw_image(image_set.bomb_1, j*gapX, i*gapY, gapX, gapY);
							case 2 :
								context.draw_image(image_set.bomb_2, j*gapX, i*gapY, gapX, gapY);
							case 3 :
								context.draw_image(image_set.bomb_3, j*gapX, i*gapY, gapX, gapY);
							case 4 :
								context.draw_image(image_set.bomb_4, j*gapX, i*gapY, gapX, gapY);
							case 5 :
								context.draw_image(image_set.bomb_5, j*gapX, i*gapY, gapX, gapY);
						}
					case Entity :
						context.draw_image(image_set.ground, j*gapX, i*gapY, gapX, gapY);
				}
			}
		}
	}
}
