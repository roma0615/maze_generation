var canvas;

// Fisher-Yates shuffle
function shuffle(array) {
  var m = array.length, t, i;
  while (m > 0) {
  	// pick an element
    i = Math.floor(Math.random() * m--);
    // swap with last
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function createWalls(mazeWidth, mazeHeight) {
	// each "cell" is a room. Initially, they all are separate.
	// aka they each have a different room id

	// as we choose random walls to dissolve, combine the rooms if 
	// the rooms on each side are different
	var cells = [];
	for (var r = 0; r < mazeHeight; r++) {
		cells[r] = [];
		for (var c = 0; c < mazeWidth; c++) {
			cells[r].push({ID:r*mazeWidth + c});
		}
	}

	// each wall is a row, a column, and an orientation (horizontal vs vertical)
	// not including the borders
	// each wall is defined by the cell below (if horiz) or to the right (if vert)
	var walls = [];
	for (var i = 0; i < mazeWidth*mazeHeight; i++) {
		// verticals
		if (i % mazeWidth != 0) {
			// this isn't a left border
			walls.push({r: Math.floor(i/mazeWidth), c: i%mazeWidth, horiz:false});
		}
		// horizontals
		if (i >= mazeWidth) {
			// this isn't a top border
			walls.push({r: Math.floor(i/mazeWidth), c: i%mazeWidth, horiz:true});
		}
	}

	walls = shuffle(walls);
	
	print('Walls length: ' + walls.length);

	// generateMaze(walls, cells, mazeWidth, mazeHeight);
	
	// now we're done
	// return the walls (to draw)
	return {i: 0, walls: walls, cells: cells};
}

function generateMaze(i, walls, cells, mazeWidth, mazeHeight) {
	if (i == -1) return {i: i, walls: walls, cells: cells};
	var wall = walls[i];
	print("Chose " + (wall.horiz ? "horizontal" : "vertical") + " wall: R" + wall.r + " C" + wall.c);
	var dc = -1; // cell to left of wall
	var dr = 0;
	if (wall.horiz) {
		dc = 0;
		dr = -1; // cell above wall
	}

	if (cells[wall.r][wall.c].ID != cells[wall.r + dr][wall.c + dc].ID) {
		// remove this wall, decrement i
		walls.splice(i, 1);
		i--;

		var id1 = cells[wall.r][wall.c].ID;
		var id2 = cells[wall.r + dr][wall.c + dc].ID;
		// their ID's are different, so remove this wall and combine ids

		print("combining " + id1 + " and " + id2);
		for (var r = 0; r < mazeHeight; r++) {
			for (var c = 0; c < mazeWidth; c++) {
				if (cells[r][c].ID == id2) {
					cells[r][c].ID = id1;
				}
			}
		}
	}

	i++;

	// this means we're done
	if (i >= walls.length) {
		i = -1;
	}
	return {i: i, walls: walls, cells: cells};
}

var res;
var w;
var h;
var speed = 3;


function setup() {
	canvas = createCanvas(windowWidth * 0.65, windowHeight * 0.75);
	canvas.parent("canvas_container");

	w = 30;
	h = 20;
	res = createWalls(w, h);

	// frameRate(0.2);
}

function draw() { 
	background("#1A1A1A");
	for (var i = 0; i < speed; i++) {
		res = generateMaze(res.i, res.walls, res.cells, w, h);
	}
	print(res);

	background("#1A1A1A");
	stroke(255);
	strokeWeight(3);

	var cw = width/w;
	var ch = height/h;

	line(1, 1, 1, height-2);
	line(width-2, 1, width-2, height-2);
	line(1 + cw, 1, width-2, 1);
	line(1, height-2, width-2-cw, height-2);
	for (var i = 0; i < res.walls.length; i++) {
		var wall = res.walls[i];
		if (wall.horiz) {
			line(wall.c * cw, wall.r * ch,
				 (wall.c + 1) * cw, wall.r * ch);
		} else {
			line(wall.c * cw, wall.r * ch,
				wall.c * cw, (wall.r+1) * ch);
		}
	}

	/*
	fill(255);
	strokeWeight(1);
	for (var r = 0; r < h; r++) {
		for (var c = 0; c < w; c++) {
			text(res.cells[r][c].ID, c*cw + 7, r*ch+ch - 10);
		}
	}
	*/

}