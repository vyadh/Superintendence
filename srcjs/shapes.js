
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

  // Spaceships

  this.glider = function(dir) {
    var se = [
      [0,0,1],
      [1,0,1],
      [0,1,1]
    ]
    return aim_diagonal(se, dir)
  }

  this.lightWeightSpaceship = function(dir) {
    var west = [
      [0,1,0,0,1],
      [1,0,0,0,0],
      [1,0,0,0,1],
      [1,1,1,1,0],
      [0,0,0,0,0],
    ]
    return aim_orthogonal(west, dir)
  }

  this.middleWeightSpaceship = function(dir) {
    var west = [
      [0,0,0,1,0,0],
      [0,1,0,0,0,1],
      [1,0,0,0,0,0],
      [1,0,0,0,0,1],
      [1,1,1,1,1,0],
      [0,0,0,0,0,0],
    ]
    return aim_orthogonal(west, dir)
  }

  this.heavyWeightSpaceship = function(dir) {
    var west = [
      [0,0,0,0,0,0,0],
      [0,0,0,1,1,0,0],
      [0,1,0,0,0,0,1],
      [1,0,0,0,0,0,0],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0],
    ]
    return aim_orthogonal(west, dir)
  }


  // Still Life (or pseudo)

  this.block = function() {
    return [
      [1,1],
      [1,1],
    ]
  }

  this.beehive = function() {
    return [
      [0,1,1,0],
      [1,0,0,1],
      [0,1,1,0],
    ]
  }

  this.aircraft_carrier = function() {
    return [
      [1,1,0,0],
      [1,0,0,1],
      [0,0,1,1],
    ]
  }

  this.pond = function() {
    return [
      [0,1,1,0],
      [1,0,0,1],
      [1,0,0,1],
      [0,1,1,0],
    ]
  }

  this.barge = function() {
    return [
      [0,1,0,0],
      [1,0,1,0],
      [0,1,0,1],
      [0,0,1,0],
    ]
  }

  this.small_lake = function() {
    return [
      [0,0,0,0,1,0,0,0,0],
      [0,0,0,1,0,1,0,0,0],
      [0,0,0,1,0,1,0,0,0],
      [0,1,1,0,0,0,1,1,0],
      [1,0,0,0,0,0,0,0,1],
      [0,1,1,0,0,0,1,1,0],
      [0,0,0,1,0,1,0,0,0],
      [0,0,0,1,0,1,0,0,0],
      [0,0,0,0,1,0,0,0,0],
    ]
  }

  this.lake = function() {
    return [
      [0,0,0,0,1,1,0,0,0,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,1,1,0,0,0,0,1,1,0],
      [1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,1],
      [0,1,1,0,0,0,0,1,1,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,0,1,0,0,1,0,0,0],
      [0,0,0,0,1,1,0,0,0,0],
    ]
  }

  this.bi_loaf_still = function() {
    return [
      [0,0,1,0,0,0,0],
      [0,1,0,1,0,0,0],
      [1,0,0,1,0,0,0],
      [0,1,1,0,1,1,0],
      [0,0,0,1,0,0,1],
      [0,0,0,1,0,1,0],
      [0,0,0,0,1,0,0],
    ]
  }


  // Degrades to Still Life

  this.very_long_house = function() {
    return [
      [0,1,1,1,1,1,0],
      [1,0,0,1,0,0,1],
      [1,1,0,0,0,1,1],
    ]
  }


  // Stable Periodic

  this.koks_galaxy = function() {
    return [
      [1,1,1,1,1,1,0,1,1],
      [1,1,1,1,1,1,0,1,1],
      [0,0,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,1,1],
      [1,1,0,0,0,0,0,0,0],
      [1,1,0,1,1,1,1,1,1],
      [1,1,0,1,1,1,1,1,1],
    ]
  }

  this.tumbler = function() {
    return [
      [0,1,0,0,0,0,0,1,0],
      [1,0,1,0,0,0,1,0,1],
      [1,0,0,1,0,1,0,0,1],
      [0,0,1,0,0,0,1,0,0],
      [0,0,1,1,0,1,1,0,0],
    ]
  }

  this.pentadecathlon = function() {
    return [
      [0,0,1,0,0,0,0,1,0,0],
      [1,1,0,1,1,1,1,0,1,1],
      [0,0,1,0,0,0,0,1,0,0],
    ]
  }


  // Effects

  this.bomb = function() {
    return [
      [1,1,1,1],
      [0,1,1,1],
    ]
  }

  this.pi_heptomino = function() {
    return [
      [1,1,1],
      [1,0,1],
      [1,0,1],
    ]
  }


  // Fuses

  this.washer_woman = function() {
    return [
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
      [1,1,1,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0],
      [1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ]
  }


  // Chaotic

  this.acorn = function() {
    return [
      [0,0,1,0,0,0,0,0],
      [0,0,0,0,1,0,0,0],
      [0,1,1,0,0,1,1,1],
    ]
  }


  // Transformations

  function aim_orthogonal(shape_west, dir) {
    if (dir == Direction.W) return shape_west
    if (dir == Direction.E) return reflectX(shape_west)
    if (dir == Direction.N) return rotateRight(shape_west)
    if (dir == Direction.S) return reflectY(rotateRight(shape_west))

    return undefined
  }

  function aim_diagonal(shape_se, dir) {
    if (dir == Direction.SE) return shape_se
    if (dir == Direction.SW) return reflectX(shape_se)
    if (dir == Direction.NE) return reflectY(shape_se)
    if (dir == Direction.NW) return reflectX(reflectY(shape_se))

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
