
// JS Event Handlers

var drag = false
function gestureStartHandler(e) { drag = true;  gestureStart(e.x, e.y) }
function gestureEndHandler(e)   { drag = false; gestureEnd  (e.x, e.y) }
function gestureMoveHandler(e)  { if (drag) { gestureMove(e.x, e.y) } }

// Events

var granularity = 50 // ms
var lastPosition = null
var vectors = Array()


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
//  var vectors = this.vectors
//
//  var filtered = filter(vectors)
//  var path = aggregate(paths(filtered))
//
//  listener(recognise(path))
  console.log(vectors) //todo remove
}


function emit(vector) {
  vectors += vector //todo add to array?
  console.log(vector)
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
  return res
}
