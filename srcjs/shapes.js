
function Shapes() {

  this.title = function() {
    return [
      [0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0,0,1,1,1,0,0,1,1,0,0],
      [1,0,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0],
      [1,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,1,1,1,0],
      [1,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0],
      [0,1,1,1,1,0,0,0,1,1,0,1,0,1,0,1,0,1,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,0,0,1,1,1,0,1,0,1,0,1],
    ]
  }

  this.acorn = function() {
    return [
      [0,0,1,0,0,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,1,1,0,0,1,1,1],
    ]
  }

  this.bomb = function() {
    return [
      [0,1,1,1,1],
      [0,0,1,1,1],
    ]
  }

  this.glider = function(dir) {
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

  this.lightweightSpaceship = function(dir) {
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

}