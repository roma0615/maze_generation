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
			cells[r].push(r*mazeWidth + c);
		}
	}

	// each wall is a row, a column, and an orientation (horizontal vs vertical)
	// not including the borders
	// each wall is defined by the cell below (if horiz) or to the right (if vert)
	var walls = [];
	for (var i = 0; i < mazeWidth*mazeHeight; i++) {
		// verticals
		if (i % mazeWidth != 0) {
			walls.push({r: Math.floor(i/mazeWidth), c: i%mazeWidth, horiz:false});
		}
		// horizontals
		if (i >= mazeWidth) {
			walls.push({r: Math.floor(i/mazeWidth), c: i%mazeWidth, horiz:true});
		}
	}
	walls = shuffle(walls);
	// return the walls (to draw)
	return {i: 0, walls: walls, cells: cells};
}

function generateMaze(i, walls, cells, mazeWidth, mazeHeight) {
	if (i == -1) return {i: i, walls: walls, cells: cells};
	var wall = walls[i];
	print("Chose " + (wall.horiz ? "horizontal" : "vertical") + " wall: R" + wall.r + " C" + wall.c);
	var dc = wall.horiz ? 0 : -1;
	var dr = wall.horiz ? -1 : 0;
	if (cells[wall.r][wall.c] !== cells[wall.r + dr][wall.c + dc]) {
		// remove this wall and decrement i
		walls.splice(i--, 1);
		var id1 = cells[wall.r][wall.c];
		var id2 = cells[wall.r + dr][wall.c + dc];
		// their ID's are different, so remove this wall and combine ids
		for (var r = 0; r < mazeHeight; r++)
			for (var c = 0; c < mazeWidth; c++)
				if (cells[r][c] == id2) cells[r][c] = id1;
	}

	if (++i >= walls.length) i = -1;
	return {i: i, walls: walls, cells: cells};
}

var res;
var w = 30;
var h = 20;
var speed = 3;

function setup() {
	canvas = createCanvas(windowWidth * 0.65,
						 windowHeight * 0.75);
	canvas.parent("canvas_container");
	res = createWalls(w, h);

	document.querySelector("#maze_size_slider").value = w/3;

	document.querySelector("#maze_size_txt").innerText = w/3;
}

function draw() {
	background("#1A1A1A");

	speed = document.querySelector("#speed_slider").value;
	document.querySelector("#speed_txt").innerText = speed;

	document.querySelector("#maze_size_txt").innerText = w/3;

	if (document.querySelector("#maze_size_slider").value*3 != w) {
		w = document.querySelector("#maze_size_slider").value * 3;
		h = document.querySelector("#maze_size_slider").value * 2;
		setup();
	}
	
	if (res.i > -1) {
		for (var i = 0; i < speed; i++) {
			res = generateMaze(res.i, res.walls, res.cells, w, h);
		}
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
			text(res.cells[r][c], c*cw + 7, r*ch+ch - 10);
		}
	}
	*/
}