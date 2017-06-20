
// JS Event Handlers

function gestures_install() {
  var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;

  // Desktop (Chrome)
  if (!isAndroid) {
    c.onmousedown = gestureStartHandler
    c.onmousemove = gestureMoveHandler
    c.onmouseup   = gestureEndHandler
  }

  // Android (Chrome)
  if (isAndroid) {
    c.addEventListener('touchstart', gestureAndroidStartHandler, false)
    c.addEventListener("touchmove", gestureAndroidMoveHandler, false)
    c.addEventListener("touchend", gestureAndroidEndHandler, false)
  }
}

function gestureStartHandler(e) { gestureStart(e.x, e.y) }
function gestureEndHandler(e)   { gestureEnd  (e.x, e.y) }
function gestureMoveHandler(e)  { gestureMove(e.x, e.y) }

function gestureAndroidStartHandler(e) {
  if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    gestureStart(touch.pageX, touch.pageY)
  }
}
function gestureAndroidMoveHandler(e) {
  if (event.targetTouches.length == 1) {
    var touch = event.targetTouches[0];
    gestureMove(touch.pageX, touch.pageY)
  }
}
function gestureAndroidEndHandler(e) {
  gestureEnd(last.x, last.x)
}

// Events

var drag = false
var granularity = 50 // ms
var vectors = Array()
var last = null


function gestureStart(x, y) {
  drag = true
  vectors = Array()
  last = position(now(), x, y)
}

function gestureMove(x, y) {
  var time = now()
  if (drag && (time - last.time) > granularity) {
    var pos = position(time, x, y)
    emit(vector(last, pos))
    last = pos
  }
}

function gestureEnd(x, y) {
  drag = false
  emit(vector(last, position(now(), x, y)))

  var point = center(vectors)

  var filtered = filterOp(vectors)
  var path = aggregate(paths(filtered))

//  listener(recognise(path))
  //todo remove
  var shape = recognise(path)
  console.log(point +": " + shape)
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
    case 3: return gesture3(path[0], path[1], path[2])
    default:
      if (n >= 6 && n <= 12) {
        var pcircle = circle(path)
        if (pcircle !== null) {
          return pcircle
        }
      }
      return "complex"//Complex(path)
  }
}

function gesture3(a, b, c) {
  if (a == c) return "zigzag"//ZigZag(a, b, c)
  if (a == c.opposite) return "U"//U(a, b, c)
  return "unknown"//Unknown(Seq(a, b, c))
}

function circle(path) {
  if (path.size < 6) return null

  if (increasing(path)) {
    return "clock"//CircleClockwise
  }
  if (decreasing(path)) {
    return "anti-clock"//CircleAntiClockwise
  }
  return null
}

function increasing(path) { return directed(path, function(x) { return x >= 0 }) }
function decreasing(path) { return directed(path, function(x) { return x <  0 }) }

function directed(path, predicate) {
  for (var i=0; i<path.length-1; i++) {
    var a = path[i]
    var b = path[i+1]
    if (!predicate(clockDist(a, b))) {
      return false
    }
  }
  return true
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

function point(x, y) {
  var res = new Object
  res.x = x
  res.y = y
  res.toString = function() { return res.x + "," + res.y }
  return res
}


// Objects

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

function opposite(direction) {
  switch (direction) {
    case Direction.N : return Direction.S
    case Direction.NE: return Direction.SW
    case Direction.E : return Direction.W
    case Direction.SE: return Direction.NW
    case Direction.S : return Direction.N
    case Direction.SW: return Direction.NE
    case Direction.W : return Direction.E
    case Direction.NW: return Direction.SE
  }
}

var CircleClockwise = new Object()
var CircleAntiClockwise = new Object()


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

/**
 * The distance between the two closest points on a clock.
 * Where a positive +ve value indicates clockwise, -ve is anti-clockwise.
 * A 'bump' is where "12 o'clock" is passed over.
 */
function clockDist(a, b) {
  if (a <= b) {
    var bump = (8-b)+a
    var norm = b-a
    var distance = Math.min(bump, norm)
    var sign = (distance == norm) ? 1 : -1
    return sign * distance
  } else {
    var bump = (8-a)+b
    var norm = a-b
    var distance = Math.min(bump, norm)
    var sign = (distance == norm) ? -1 : 1
    return sign * distance
  }
}

function center(vectors) {
  var xs = Array()
  addAll(xs, vectors.map(function(v) { return v.start.x }))
  addAll(xs, vectors.map(function(v) { return v.end.x }))

  var ys = Array()
  addAll(ys, vectors.map(function(v) { return v.start.y }))
  addAll(ys, vectors.map(function(v) { return v.end.y }))

  var x = mid(min(xs), max(xs))
  var y = mid(min(ys), max(ys))
  return point(x, y)
}

function addAll(array, items) {
  for (var i=0; i<items.length; i++) {
    array.push(items[i])
  }
}

function mid(min, max) {
  return min + (max-min)/2
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

function min(array) {
  var result = array[0]
  for (var i=1; i<array.length; i++) {
    var item = array[i]
    if (item < result) {
      result = item
    }
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
