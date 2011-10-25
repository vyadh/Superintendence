window.onload = start

var BENCH = false

var dim = 40 // Cell Size
var fps = 2

var c // Canvas
var g // Graphics Context
var w // Width
var h // Height
var cellsX // Number of cells on the X-axis
var cellsY // Number of cells on the Y-axis
var grid   // Cell state
var ticker // Animation timer, handle used for cancelling


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
//  dim = 2
//  init(500, 400)
//  benchmark(200, tick)

  // MacBook
  dim = 3
  init(500, 400)
  benchmark(225, tick)
}

function startNormal() {
  window.onresize = reinit
  window.onkeydown = doKeyDown

  // iOS todo rename "onAction"
  c.ontouchmove=iOSblockMove
  c.ontouchend=iOStoggle
  c.ongesturestart=iOSgestureStart
  c.ongesturechange=iOSgesture
  c.ongestureend=iOSgestureEnd

  reinit()
}

var zooming = false
function iOSblockMove(event) {  event.preventDefault() }
function iOStoggle(event) {  if (!zooming) { toggle() } }
function iOSgestureStart(event) { zooming = true }
function iOSgesture(event) { zoom(event.scale >= 1) }
function iOSgestureEnd(event) { zooming = false }

function reinit() {
//  init(window.innerWidth, window.innerHeight)
  init(120, 120)
}

function init(width, height) {
  c.width  = width
  c.height = height
  w = c.width
  h = c.height

  cellsX = Math.floor(w/dim)
  cellsY = Math.floor(h/dim)

  gridInit()

  // Create a random population
//  visitAll(random)
//  resolve()

  arr = new Array
  show(new Array(
    new Array( true, false, false),
    new Array( true, true,  false),
    new Array( false, false, false)
  ))

  redraw()
}

function redraw() {
  clear()
  drawGrid()
}

function random(x, y, alive) {
  set(x, y, Math.random() >= 0.7)
}

function drawGrid() {
  visitRead(drawCell)
}


//==-- Events

function doKeyDown(event) {
  switch (event.keyCode) {
    case 32: // Space
      toggle()
      break;
    case 00: // todo 's'
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
  for (var x=0; x<array.length; x++) {
    var column = array[x];
    for (var y=0; y<column.length; y++) {
      var alive = column[y];
      if (alive) {
        set(x, y, alive)
      }
    }
  }
  resolve()
  drawGrid()
}

function tick() {
  visitWrite(nextGeneration)
  resolve()
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
  return ticker != undefined
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

function drawCell(x, y, alive) {
  // Optimisation, don't draw when not required
  if (peekChange(x, y, alive)) {
    return
  }

  // Get pixel positions
  var xp = x * dim
  var yp = y * dim

  g.fillStyle = colour(alive)
  g.fillRect(xp+1, yp+1, dim-1, dim-1)
}

function colour(alive) {
  if (alive) {
    return "rgb( 0, 255,  0)"
  } else {
    return "rgb(64,  64, 64)"
  }
}

function clear() {
  g.fillStyle = "rgb(0,0,0)"
  g.fillRect(0, 0, w, h)
}


//==-- Business Logic

function nextGeneration(x, y, alive) {
  var count = neighbours(x, y)
  set(x, y, nextAlive(alive, count))
}

function neighbours(x, y) {
  return neighbour(x-1, y-1) +
         neighbour(x-1, y+0) +
         neighbour(x-1, y+1) +
         neighbour(x+0, y-1) +
         neighbour(x+0, y+1) +
         neighbour(x+1, y-1) +
         neighbour(x+1, y+0) +
         neighbour(x+1, y+1)
}

function neighbour(x, y) {
  return (isAlive(x, y)) ? 1 : 0
}

function nextAlive(alive, neighbours) {
  if (alive) {
    if (neighbours <  2) return false
    if (neighbours <= 3) return true
  }
  else {
    return neighbours == 3
  }
  return false
}

function isAlive(x, y) {
  if (x < 0 || x >= cellsX) return false
  if (y < 0 || y >= cellsY) return false
  return get(x, y)
}


//==-- Grid API

function gridInit() {
  grid = new Grid(cellsX, cellsY)
}

function get(x, y) {
  return grid.cell(x, y)
}

function peekChange(x, y, alive) {
  //return grid.prime(x, y, alive)
}

function set(x, y, alive) {
  grid.prime(x, y, alive)
}

function visitAll(f) { visitAll_Live(f) }
function visitRead(f) { visitRead_Live(f) }
function visitWrite(f) { visitWrite_Live(f) }
function resolve() { resolve_Live() }

//==-- Grid (1D)

function gridInit_1D() {
  grid   = createGrid2D()
  shadow = createGrid2D()
}

function createGrid_1D() {
  var size = cellsX * cellsY
  return new Array(size)
}

function get_1D(x, y) {
  var index = y * cellsX + x
  return grid[index]
}

function peek_1D(x, y) {
  var index = y * cellsX + x
  return shadow[index]
}

function set_1D(x, y, alive) {
  var index = y * cellsX + x
  shadow[index] = alive
}

function visitAll_1D(f) { visit_1D(f) }
function visitRead_1D(f) { visit_1D(f) }
function visitWrite_1D(f) { visit_1D(f) }

function visit_1D(f) {
  var size = cellsX * cellsY
  for (var i=0; i<size; i++) {
    var alive = grid[i]
    var x = (i % cellsX)
    var y = Math.floor(i / cellsX)
    f(x, y, alive)
  }
}

function resolve_1D() {
  var tmp = grid
  grid = shadow
  shadow = tmp
}



//todo optimisations:
// use a boundary
// store neighbours on for each cell

//==-- Helpers

function canvas()  { return document.getElementById('life') }
function context() { return canvas().getContext('2d') }

function TreeSet() {
  this.items = new Array
  this.keys = new Array

  this.clear = function() {
    items.length = 0
    keys.length = 0
  }

  this.add = function(item) {
    if (!this.contains(item)) {
      this.items.push(item)
      this.keys[item] = true
    }
  }

  this.contains = function(item) {
    return this.keys[item] == true
  }

  this.size = function() {
    return this.items.length
  }
}


//==-- Benchmark

function benchmark(iterations, f) {
  var i = iterations

  var start = new Date
  while (i--) {
    f()
  }
  var end = new Date

  var total = new Date - start
  console.log("Finished: " + total)
}
