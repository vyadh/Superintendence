
// JS Event Handlers

var drag = false
function gestureStartHandler(e) { drag = true;  gestureStart(e.x, e.y) }
function gestureEndHandler(e)   { drag = false; gestureEnd  (e.x, e.y) }
function gestureMoveHandler(e)  { if (drag) { gestureMove(e.x, e.y) } }

// Events

var granularity = 50 // ms
var lastPosition = null
var vectors = Array()
var last = null


function gestureStart(x, y) {
  vectors = Array()
  last = position(now(), x, y)
}

function gestureMove(x, y) {
  var time = now()
  if ((time - last.time) > granularity) {
    var pos = position(time, x, y)
    emit(vector(last, pos))
    last = pos
  }
}

function gestureEnd(x, y) {
  emit(vector(last, position(now(), x, y)))

  var filtered = filterOp(vectors)
  var path = aggregate(paths(filtered))

//  listener(recognise(path))
  //todo remove
  var shape = recognise(path)
  console.log(shape)
}

function emit(vector) {
  vectors.push(vector)
  console.log(vector)
}


// Calculation

/** Filter out both points of changes in direction, and small unintended perpendicular drifts. */
function filterOp(vectors) {
  var maxv = max(map(vectors,  function(v) { return v.magnitude }))
  // Ignore anything under 20% of top speed
  return filter(vectors, function(v) { return v.magnitude / maxv > 0.20 })
}

function paths(vectors) {
  return map(vectors, function(v) { return v.direction() })
}

function aggregate(path) {
  var result = new Array()
  var rest = path
  while (rest.length > 0) {
    var current = rest[0]
    rest = dropWhile(rest, function(x) { return x == current })
    result.push(current)
  }
  return result
}


// Gesture Analysis

function recognise(path) {
  var n = path.length
  switch (n) {
    case 0: return "point"//Gesture.Point
    case 1: return "line"//Line(path[0]) //todo but Point, if magnitude is small (accidental mouse move on click)
    case 2: return "angle"//Angle(path[0], path[1])
    case 3: return "g3"//gesture3(path[0], path[1], path[2])
    default:
//      if (n >= 6 && n <= 12) {
//        var pcircle = circle(path)
//        if (pcircle !== null) {
//          return pcircle
//        }
//      }
      return "complex"//Complex(path)
  }
}


// Factory methods

function now() {
  return new Date()
}

function position(time, x, y) {
  var res = new Object
  res.time = time
  res.x = x
  res.y = y
  return res
}

function vector(start, end) {
  var res = new Object

  res.start = start
  res.end = end

  res.x = end.x - start.x
  res.y = end.y - start.y

  res.magnitude = Math.sqrt(Math.pow(res.x, 2) + Math.pow(res.y, 2))

  res.angle = function() {
    var zeroToTwoPi = Math.atan2(res.y, res.x) + Math.PI
    var rotated = toDegrees(zeroToTwoPi) - 90
    return (rotated < 0) ? rotated + 360 : rotated
  }

  res.direction = function() {
    var a = res.angle()
    if (slice(a,   0.0)) return Direction.N
    if (slice(a,  45.0)) return Direction.NE
    if (slice(a,  90.0)) return Direction.E
    if (slice(a, 135.0)) return Direction.SE
    if (slice(a, 180.0)) return Direction.S
    if (slice(a, 225.0)) return Direction.SW
    if (slice(a, 270.0)) return Direction.W
    if (slice(a, 315.0)) return Direction.NW
    if (slice(a, 360.0)) return Direction.N
  }

  return res
}


var Direction = new Object()
{
  Direction.N  = 1
  Direction.NE = 2
  Direction.E  = 3
  Direction.SE = 4
  Direction.S  = 5
  Direction.SW = 6
  Direction.W  = 7
  Direction.NW = 8
}


// Utility methods

function toDegrees(radians) {
  return radians * (180 / Math.PI)
}

function slice(angle, around) {
  return between(angle, around-22.5, around+22.5)
}

function between(n, min, max) {
  return n >= min && n <= max
}


// Functional helpers

function filter(array, predicate) {
  var result = Array()
  for (var i=0; i<array.length; i++) {
    var item = array[i]
    if (predicate(item)) {
      result.push(item)
    }
  }
  return result
}

function map(array, f) {
  var result = new Array(array.length)
  for (var i=0; i<array.length; i++) {
    result[i] = f(array[i])
  }
  return result
}

function max(array) {
  var result = array[0]
  for (var i=1; i<array.length; i++) {
    var item = array[i]
    if (item > result) {
      result = item
    }
  }
  return result
}

function dropWhile(array, predicate) {
  var result = Array()
  var drop = true
  for (var i=1; i<array.length; i++) {
    var item = array[i]
    drop = drop && predicate(item)
    if (!drop) {
      result.push(item)
    }
  }
  return result
}
