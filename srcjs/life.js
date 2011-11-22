window.onload = start

var BENCH = false

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
  window.onresize = reinit
  window.onkeydown = doKeyDown

  // Desktop (Chrome)
  c.onmousedown = gestureStartHandler
  c.onmousemove = gestureMoveHandler
  c.onmouseup   = gestureEndHandler

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

  // Create a random population
//  showf(random)
  show([
    [ true,  false, false ],
    [ true,  false, false ],
    [ false, false, false ]
  ])
  acorn()
}

function acorn() {
  var x = Math.floor(cellsX / 2)
  var y = Math.floor(cellsY / 2)

  grid.activate(x + 3, y + 2)
  grid.activate(x + 2, y + 4)
  grid.activate(x + 3, y + 4)
  grid.activate(x + 5, y + 3)
  grid.activate(x + 6, y + 4)
  grid.activate(x + 7, y + 4)
  grid.activate(x + 8, y + 4)

  grid.commit()
  drawGrid()
}

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
      toggle()
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

function clear() {
  g.fillStyle = "rgb(0, 0, 0)"
  g.fillRect(0, 0, w, h)
}


//todo optimisations:
// use a boundary
// store neighbours on for each cell

//==-- Helpers

function canvas()  { return document.getElementById('life') }
function context() { return canvas().getContext('2d') }


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
