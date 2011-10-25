
/**
 * JavaScript GOL grid, post optimisation.
 * todo boundary grid
 *
 * MacBook:
 * ?
 *
 */
function Grid(dimX, dimY) {

  this.dimX = dimX
  this.dimY = dimY
  var cellCount = dimX * dimY
  this.grid = new Array(cellCount)
  this.dirty = new Dirty
  this.changes = new Changes
  this.painting = Array()


  this.tick = function() {
    step()
    commit()
  }

  this.commit = function() {
    var consumed = changes.consume()
    for (index in consumed) {
      var alive = consumed[index]
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
    this.changes.add(this.index(x, y), alive)
    mark(x, y)
  }

  this.activate = function(x, y) {
    prime(x, y, true)
  }


  this.x = function(i) { return (i % dimX) + 1 }
  this.y = function(i) { return (i / dimX) + 1 }

  this.index = function(x, y) { return (y - 1) * dimX + (x - 1) }

  this.mark = function(x, y) {
    var minX = (x == 1) ? 0 : -1
    var minY = (y == 1) ? 0 : -1
    var maxX = (x == dimX) ? 0 : 1
    var maxY = (y == dimY) ? 0 : 1

    for (var xd = minX; xd <= maxX; xd++) {
      for (var yd = minY; yd <= maxY; yd++) {
        dirty.add(index(x+xd, y+yd))
      }
    }
  }

  this.step = function() {
    var current = dirty.consume()

    for (var i = 0; i < current.length; i++) {
      var index = current[i]
      var x = this.x(index)
      var y = this.y(index)
      var before = cell(x, y)
      var n = neighbours(x, y)
      var after = alive(before, n)
      if (before != after) {
        prime(x, y, after)
      }
    }
  }

  this.neighbours = function(x, y) {
    return neighbour(x, y, -1, -1) +
           neighbour(x, y, -1,  0) +
           neighbour(x, y, -1,  1) +
           neighbour(x, y,  0, -1) +
           neighbour(x, y,  0,  1) +
           neighbour(x, y,  1, -1) +
           neighbour(x, y,  1,  0) +
           neighbour(x, y,  1,  1)
  }

  this.neighbour = function(x, y, xd, yd) {
    return (cell(x + xd, y + yd)) ? 1 : 0
  }

  this.alive = function(alive, neighbours) {
    if (alive) {
      if (neighbours <  2) return false
      if (neighbours <= 3) return true
    }
    else {
      return neighbours == 3
    }
    return false
  }

  this.draw = function(g, scale) {
    for (var i = 0; i < painting.length; i++) {
      var encoded = painting[i]
      var index = changes.decodeIndex(encoded)
      var alive = changes.decodeAlive(encoded)

      var colour = alive ? Color.GREEN : Color.DARK_GRAY
      g.setColor(colour)

      var xp = x(index)
      var yp = y(index)
      var sx = scale * (xp - 1)
      var sy = scale * (yp - 1)

      g.fillRect(sx + 1, sy + 1, scale - 1, scale - 1)
    }
    painting = new Array()
  }

  this.count = function() {
    var sum = 0
    for (cell in grid) {
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
  function Changes() {
    var changes = new Array(cellCount)
    var length = 0

    function add(index, alive) {
      changes(length) = encode(index, alive)
      length += 1
    }

    function encode(index, alive) { return (alive) ? index+cellCount : index }

    function decodeIndex(value) { return (value >= cellCount) ? value-cellCount : value }
    function decodeAlive(value) { return value >= cellCount }

    function consume() {
      var res = changes.take(length).map(decode) //todo optimise?
      length = 0
      return res
    }
  }

  function Dirty() {
    var set = new Array(cellCount)
    var changes = new Array(cellCount)
    var length = 0
    function size() { return length }

    function add(index) {
      if (!set(index)) {
        set(index) = true
        changes(length) = index
        length += 1
      }
    }

    function consume() {
      var res = changes.take(length+1) //todo optimise?
      set = new Array[Boolean](cellCount)
      length = 0
      return res
    }
  }

}
