
/**
 * JavaScript GOL grid, post optimisation.
 * todo boundary grid
 *
 * MacBook:
 * ?
 *
 */
function Grid(dimX, dimY) {

  var cellCount = dimX * dimY
  var grid = newArray(cellCount, false)
  var dirty = new Dirty
  var changes = new Changes
  /** Array of only the changes required to update the grid. */
  var painting = null

  this.clear = function() {
    grid = newArray(cellCount, false)
    dirty.consume()
    changes.consume()
    painting = null
    this.draw()
  }

  this.tick = function() {
    this.step()
    this.commit()
  }

  this.commit = function() {
    var consumed = changes.consume()
    for (var i=0; i<consumed.readSize; i++) {
      var encoded = consumed.read[i]
      var index = changes.decodeIndex(encoded)
      var alive = changes.decodeAlive(encoded)
      grid[index] = alive
    }
    painting = consumed
  }

  this.cell = function(x, y) {
    if (x <= 0 || x > dimX || y <= 0 || y > dimY) {
      return false
    }
    return grid[index(x, y)]
  }

  this.prime = function(x, y, alive) {
    changes.add(index(x, y), alive)
    mark(x, y)
  }

  this.activate = function(x, y) {
    this.prime(x, y, true)
  }


  function x(i) { return (i % dimX) + 1 }
  function y(i) { return Math.floor(i / dimX) + 1 }

  function index(x, y) { return (y - 1) * dimX + (x - 1) }

  var mark = function(x, y) {
    var minX = (x === 1) ? 0 : -1
    var minY = (y === 1) ? 0 : -1
    var maxX = (x === dimX) ? 0 : 1
    var maxY = (y === dimY) ? 0 : 1

    for (var xd = minX; xd <= maxX; xd++) {
      for (var yd = minY; yd <= maxY; yd++) {
        dirty.add(index(x+xd, y+yd))
      }
    }
  }

  this.step = function() {
    var current = dirty.consume()

    for (var i = 0; i < current.readSize; i++) {
      var index = current.read[i]
      var xp = x(index)
      var yp = y(index)
      var before = this.cell(xp, yp)
      var n = this.neighbours(xp, yp)
      var after = this.alive(before, n)
      if (before !== after) {
        this.prime(xp, yp, after)
      }
    }
  }

  this.neighbours = function(x, y) {
    return this.neighbour(x, y, -1, -1) +
           this.neighbour(x, y, -1,  0) +
           this.neighbour(x, y, -1,  1) +
           this.neighbour(x, y,  0, -1) +
           this.neighbour(x, y,  0,  1) +
           this.neighbour(x, y,  1, -1) +
           this.neighbour(x, y,  1,  0) +
           this.neighbour(x, y,  1,  1)
  }

  this.neighbour = function(x, y, xd, yd) {
    return (this.cell(x + xd, y + yd)) ? 1 : 0
  }

  this.alive = function(alive, neighbours) {
    if (alive) {
      if (neighbours <  2) return false
      if (neighbours <= 3) return true
    }
    else {
      return neighbours === 3
    }
    return false
  }

  this.draw = function(g, scale) {
    for (var i = 0; i < painting.readSize; i++) {
      var encoded = painting.read[i]
      var index = changes.decodeIndex(encoded)
      var alive = changes.decodeAlive(encoded)

      var colour = alive ? "rgb( 0, 255,  0)" : "rgb(64,  64, 64)"
      g.fillStyle = colour

      var xp = x(index)
      var yp = y(index)
      var sx = scale * (xp - 1)
      var sy = scale * (yp - 1)

      g.fillRect(sx+1, sy+1, scale-1, scale-1)
    }
    painting = null
  }

  this.count = function() {
    var sum = 0
    for (var cell in grid) {
      sum += (cell ? 1 : 0)
    }
    return sum
  }

/*
  function toString {
    var rows = grid.sliding(dimX, dimX)
    def cell(alive) = if (alive) "X" else "O"
    var strs = rows.map(_.map(cell).mkString)
    var res = strs.mkString("\n")
    return res
  }
*/

  /*
   * A buffered array with additional functionality to encode and decode indices.
   */
  function Changes() {
    var changes = FlipArray.create(cellCount)

    this.add = function(index, alive) {
      changes.add(encode(index, alive))
    }

    function encode(index, alive) { return alive ? index+cellCount : index }

    this.decodeIndex = function(value) { return (value >= cellCount) ? value-cellCount : value }
    this.decodeAlive = function(value) { return value >= cellCount }

    this.consume = function() {
      changes.flip()
      changes.reset()
      return changes
    }
  }

  /*
   * Simulate a set-like data structure using the buffered array,
   * only adding changes if they don't exist.
   */
  function Dirty() {
    var setView = new Array(cellCount)
    var dirty = FlipArray.create(cellCount)

    this.add = function(value) {
      if (!setView[value]) {
        setView[value] = true
        dirty.add(value)
      }
    }

    this.consume = function() {
      setView = new Array(cellCount)
      dirty.flip()
      dirty.reset()
      return dirty
    }
  }

  function newArray(size, value) {
    var res = new Array(size)
    for (var i=0; i<size; i++) {
      res[i] = value
    }
    return res
  }

}
