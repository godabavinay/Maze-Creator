var rows, cols;
var w = 30;

var grid = [];

var stack = [];

var current;

function setup() {
  createCanvas(600, 600);

  rows = floor(height / w);
  cols = floor(width / w);

//   frameRate(5);

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
}

function draw() {
  background(40);

  current.visited = true;
  current.highlight();

  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  //   STEP 1
  var next = current.checkNeighbors();

  if (next) {
    next.visited = true;

    // STEP 2
    stack.push(current);

    // STEP 3
    removeWall(current, next);

    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > rows - 1 || j > cols - 1) {
    return -1;
  }
  return i * cols + j;
}

function Cell(i, j) {
  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;

  this.highlight = function() {
    var x = this.i * w;
    var y = this.j * w;
    noStroke();
    fill(255, 255, 0);
    rect(x, y, w, w);
  };

  this.checkNeighbors = function() {
    var neighbors = [];

    var top = grid[index(i - 1, j)];
    var right = grid[index(i, j + 1)];
    var bottom = grid[index(i + 1, j)];
    var left = grid[index(i, j - 1)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  this.show = function() {
    var x = this.i * w;
    var y = this.j * w;

    stroke(255);

    if (this.walls[0]) {
      line(x, y, x, y + w);
    }
    if (this.walls[1]) {
      line(x, y + w, x + w, y + w);
    }
    if (this.walls[2]) {
      line(x + w, y + w, x + w, y);
    }
    if (this.walls[3]) {
      line(x + w, y, x, y);
    }

    if (this.visited) {
      noStroke();
      fill(100, 50, 255, 100);
      rect(x, y, w, w);
    }
  };
}

function removeWall(a, b) {
  var x = a.i - b.i;

  if (x === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (x === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }

  var y = a.j - b.j;

  if (y === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (y === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
}
