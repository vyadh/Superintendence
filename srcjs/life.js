window.onload = main

var BENCH = false

var android = navigator.userAgent.toLowerCase().indexOf("android") > -1;
var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
var mobile = android || iOS

var dim = mobile ? 8 : 5 // Cell Size
var fps = mobile ? 25 : 20
var clock = 0 // Increments every frame, allows periodic actions

var c // Canvas
var g // Graphics Context
var w // Width
var h // Height
var cellsX // Number of cells on the X-axis
var cellsY // Number of cells on the Y-axis
var grid   // Cell state
var ticker // Animation timer, handle used for cancelling

var gestures = new Gestures(gestureHandler)
var shapes = new Shapes()


function main() {
  c = canvas()
  g = context()

  if (BENCH) {
    mainBenchmark()
  } else {
    mainNormal()
  }
}

function mainBenchmark() {
  // Beefy PC
  dim = 2
  init(500, 400)
  displayAcorn()
  benchmark(5000, tick)

  // MacBook
//  dim = 3
//  init(500, 400)
//  benchmark(225, tick)
}

function displayAcorn() {
  var x = Math.floor(cellsX / 2)
  var y = Math.floor(cellsY / 2)
  activate(x, y, shapes.acorn())
  drawGrid()
}

function mainNormal() {
  if (!mobile) {
    window.onkeydown = doKeyDown
  }
  gestures.install(c)

  window.onresize = reinit
  reinit()

  activate(20, 20, shapes.title())
  drawGrid()
  activate(200, 100, shapes.glider(Direction.NW))
  drawGrid()

//  if (mobile) {
    ensureStarted()
//  }
}

function reinit() {
  init(window.innerWidth, window.innerHeight)
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
}

// Create a random population
function random(x, y, alive) {
  return Math.random() >= 0.7
}

function drawGrid() {
  grid.draw(g, dim, clock)
}


//==-- Events

function doKeyDown(event) {
  switch (event.keyCode) {
    case 32: // Space
      ensureStarted()
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
  clock++
}

function toggle() {
  if (isAnimating()) {
    stop()
  } else {
    animate(fps)
  }
}

function ensureStarted() {
  if (!isAnimating()) {
    animate(fps)
  }
}

function isAnimating() {
  return !(typeof ticker === "undefined")
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

  switch (shape) {
    case "point":
      activateByPoint(point, shapes.bomb())
      break;
    case "line":
      if (Direction.diagonal(path[0])) {
        activateByPoint(point, shapes.glider(path[0]))
      }
      else if (Direction.pure(path[0])) {
        activateByPoint(point, shapes.lightWeightSpaceship(path[0]))
      }
      break;
    case "zigzag":
      activateByPoint(point, shapes.pi_heptomino())
      break;
    case "angle":
      activateByPoint(point, shapes.pentadecathlon())
      break;
    case "clock":
      activateByPoint(point, shapes.koks_galaxy())
      break;
    case "anti-clock":
      activateByPoint(point, shapes.tumbler())
      break;
    case "complex":
      activateByPoint(point, shapes.lake())
      break;
    case "U":
      activateByPoint(point, shapes.very_long_house())
      break;

    case "?": //todo
      showf(random)
      break;
    case "?": //todo
      grid.clear()
      clear()
      break;
  }

  if (!isAnimating()) {
    drawGrid()
  }
}

function activateByPoint(screenPoint, shape) {
  var gridPoint = screenPointToGrid(screenPoint)
  var point = centreOnShape(gridPoint, shape)
  activate(point.x, point.y, shape)
}

function centreOnShape(point, shape) {
  var h = shape.length
  var w = shape[0].length
  var cx = Math.floor(point.x - (w / 2))
  var cy = Math.floor(point.y - (h / 2))
  return {x: cx, y: cy}
}

function activate(rx, ry, shape) {
  if (shape === undefined) {
    return
  }
  var x = Math.round(rx)
  var y = Math.round(ry)

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

function screenPointToGrid(point) {
  var cx = Math.floor(point.x / dim)
  var cy = Math.floor(point.y / dim)
  return {x: cx, y: cy}
}


//==-- Benchmark (Beefy)
// 4880: Original
// 4395: Optimised
// 4305: Changed slice to use buffered array (very little benefit in JS)
// Year 2017
//  ~60: Chrome 59 @ 200 iterations (!)
// 3900: Chrome 59 @ 5000 iterations
// 9500: Chrome 59 / Trails

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
