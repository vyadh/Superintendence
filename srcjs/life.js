window.onload = start

var BENCH = false
var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

var dim = 5 // Cell Size
var fps = 30

var c // Canvas
var g // Graphics Context
var w // Width
var h // Height
var cellsX // Number of cells on the X-axis
var cellsY // Number of cells on the Y-axis
var grid   // Cell state
var ticker // Animation timer, handle used for cancelling

var gestures = new Gestures(gestureHandler)


function start() {
  c = canvas()
  g = context()

  if (BENCH) {
    startBenchmark()
  } else {
    startNormal()
  }
}

function startBenchmark() {
  // Beefy PC
  dim = 2
  init(500, 400)
  benchmark(200, tick)

  // MacBook
//  dim = 3
//  init(500, 400)
//  benchmark(225, tick)
}

function startNormal() {
//  window.onresize = reinit
//
//  if (!isAndroid) {
//    window.onkeydown = doKeyDown
//  }

  gestures.install(c)

  // iOS todo refactor gestures
//  c.ontouchmove=iOSblockMove
//  c.ontouchend=iOStoggle
//  c.ongesturestart=iOSgestureStart
//  c.ongesturechange=iOSgesture
//  c.ongestureend=iOSgestureEnd

  reinit()
}

var zooming = false
function iOSblockMove(event) {  event.preventDefault() }
function iOStoggle(event) {  if (!zooming) { toggle() } }
function iOSgestureStart(event) { zooming = true }
function iOSgesture(event) { zoom(event.scale >= 1) }
function iOSgestureEnd(event) { zooming = false }

function reinit() {
  init(window.innerWidth, window.innerHeight)
//  init(120, 120)
}

function init(width, height) {
  c.width  = width
  c.height = height
  w = c.width
  h = c.height

  cellsX = Math.floor(w/dim)
  cellsY = Math.floor(h/dim)

  window.status='X=' + cellsX + ', Y=' + cellsX + ' dim=' + dim

  grid = new Grid(cellsX, cellsY)

  clear()

  var midX = Math.floor(cellsX / 2)
  var midY = Math.floor(cellsY / 2)

  drawGrid()
  toggle()
}

// Create a random population
function random(x, y, alive) {
  return Math.random() >= 0.7
}

function drawGrid() {
  grid.draw(g, dim)
}


//==-- Events

function doKeyDown(event) {
  switch (event.keyCode) {
    case 32: // Space
//      toggle()
      break;
    case 83: // 's'
      tick()
      break
    case 189: // Minus
      zoom(false)
      break
    case 187: // Plus/Equals
      zoom(true)
      break
  }
}


//==-- Actions

function show(array) {
  for (var x=1; x<=array.length; x++) {
    var column = array[x-1];
    for (var y=1; y<=column.length; y++) {
      var alive = column[y-1];
      if (alive) {
        grid.prime(x, y, alive)
      }
    }
  }
  grid.commit()
  drawGrid()
}

function showf(f) {
  for (var x=1; x<=cellsX; x++) {
    for (var y=1; y<=cellsY; y++) {
      var alive = f(x, y, grid.cell(x, y));
      if (alive) {
        grid.prime(x, y, alive)
      }
    }
  }
  grid.commit()
  drawGrid()
}

function tick() {
  grid.tick()
  drawGrid()
}

function toggle() {
  if (isAnimating()) {
    stop()
  } else {
    animate(fps)
  }
}

function isAnimating() {
  return ticker !== undefined
}

function animate(fps) {
  var millis = 1000 / fps
  ticker = setInterval(tick, millis)
}

function stop() {
  clearTimeout(ticker)
  ticker = undefined
}

function zoom(direction) {
  var value
  if (direction) { value = 1 } else { value = -1 }
  dim = Math.max(2, dim + value)
  reinit()
}


//==-- Painting

function clear() {
  g.fillStyle = "rgb(0, 0, 0)"
  g.fillRect(0, 0, w, h)
}


//==-- Gesture Handling

function gestureHandler(point, shape, path) {
  console.log(point +": " + path + " -> " + shape)
  if (shape === "line" && Direction.diagonal(path[0])) {
    activateByPoint(point, glider(path[0]))
  }
  if (shape === "line" && Direction.pure(path[0])) {
    activateByPoint(point, lightweightSpaceship(path[0]))
  }
  if (shape === "zigzag") {
    showf(random)
  }
  if (shape === "angle") {
    activateByPoint(point, acorn())
  }
  if (shape === "anti-clock") {
    grid.clear()
    clear()
  }
}


//==-- Shapes

function acorn() {
  return [
    [0,0,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,0,0,0,1,0,0,0],
    [0,1,1,0,0,1,1,1],
  ]
}

function glider(dir) {
  var se = [
    [0,0,1],
    [1,0,1],
    [0,1,1]
  ]
  if (dir == Direction.SE) return se
  if (dir == Direction.SW) return reflectX(se)
  if (dir == Direction.NE) return reflectY(se)
  if (dir == Direction.NW) return reflectX(reflectY(se))

  return undefined
}

function lightweightSpaceship(dir) {
  var west = [
    [0,1,0,0,1],
    [1,0,0,0,0],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [0,0,0,0,0]
  ]
  if (dir == Direction.W) return west
  if (dir == Direction.E) return reflectX(west)
  if (dir == Direction.N) return rotateRight(west)
  if (dir == Direction.S) return reflectY(rotateRight(west))

  return undefined
}

function activateByPoint(point, shape) {
  activate(cx(point.x), cy(point.y), shape)
}

function activate(x, y, shape) {
  if (shape === undefined) {
    return
  }
  for (var j=0; j<shape.length; j++) {
    for (var i=0; i<shape[j].length; i++) {
      if (shape[j][i] === 1) {
        var xp = x + i + 1
        var yp = y + j + 1
        grid.activate(xp, yp)
      }
    }
  }
  grid.commit()
}


//todo optimisations:
// use a boundary
// store neighbours on for each cell

//==-- Helpers

function canvas()  { return document.getElementById('life') }
function context() { return canvas().getContext('2d') }

function cx(x) { return Math.floor(x/dim) }
function cy(y) { return Math.floor(y/dim) }

function reflectX(matrix) {
  var res = new Array(matrix.length)
  for (var y=0; y<matrix.length; y++) {
    var row = matrix[y]
    res[y] = new Array(row.length)
    for (var x=0; x<row.length; x++) {
      res[y][row.length - x - 1] = matrix[y][x]
    }
  }
  return res
}

function reflectY(matrix) {
  var res = new Array(matrix.length)
  for (var y=0; y<matrix.length; y++) {
    var row = matrix[y]
    res[y] = matrix[row.length - y - 1]
  }
  return res
}

function rotateRight(matrix) {
  var dim = matrix.length
  var res = new Array(dim)
  for (var y=0; y<dim; y++) {
    var row = matrix[y]
    res[y] = new Array(dim)
    for (var x=0; x<dim; x++) {
      res[y][x] = matrix[dim-x-1][y]
    }
  }
  return res
}


//==-- Benchmark (Beefy)
// 4880: Original
// 4395: Optimised
// 4305: Changed slice to use buffered array (very little benefit in JS)

function benchmark(iterations, f) {
  var i = iterations

  var start = new Date
  while (i > 0) {
    f()
    i--
  }
  var end = new Date

  var total = new Date - start
  console.log("Finished: " + total)
}
