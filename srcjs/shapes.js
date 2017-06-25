
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
    ]
    return aim_orthogonal(west, dir)
  }

  this.heavyWeightSpaceship = function(dir) {
    var west = [
      [0,0,0,1,1,0,0],
      [0,1,0,0,0,0,1],
      [1,0,0,0,0,0,0],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,0],
    ]
    return aim_orthogonal(west, dir)
  }

  this.hivenudger = function(dir) {
    var left_a = this.lightWeightSpaceship(Direction.W)
    var left_b = reflectY(left_a)

    var top = concat(compose_x)(left_b, space(3, 5), left_a)
    var mid = concat(compose_x)(space(5, 3), block(2, 3), space(6, 3))
    var bot = reflectY(top)

    var west = concat(compose_y)(top, space(1, 1), mid, space(1, 1), bot)

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

  this.octagon_ii = function() {
    return [
      [0,0,0,1,1,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,1,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1],
      [0,1,0,0,0,0,1,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,1,1,0,0,0],
    ]
  }

  this.clock_ii = function() {
    return [
      [0,0,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,0,0,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [1,1,0,1,0,0,0,0,1,0,0,0],
      [1,1,0,1,0,0,1,0,1,0,0,0],
      [0,0,0,1,0,0,1,0,1,0,1,1],
      [0,0,0,1,0,1,0,0,1,0,1,1],
      [0,0,0,0,1,1,1,1,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,0,0],
      [0,0,0,0,1,1,0,0,0,0,0,0],
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
      res[y] = matrix[matrix.length - y - 1]
    }
    return res
  }

  function rotateRight(matrix) {
    var dim_y = matrix.length
    var dim_x = matrix[0].length
    var res = newMatrix(dim_y, dim_x)
    for (var y = 0; y < dim_y; y++) {
      for (var x = 0; x < dim_x; x++) {
        res[x][dim_y-1-y] = matrix[y][x]
      }
    }
    return res;
  }

  function rotateLeft(matrix) {
    return times(rotateRight, matrix, 3)
  }

  function newMatrix(dim_x, dim_y) {
    var res = new Array(dim_y)
    for (var y=0; y<dim_y; y++) {
      res[y] = new Array(dim_x)
    }
    return res
  }

  function times(f, matrix, n) {
    var res = matrix
    for (var i=0; i<n; i++) {
      res = f(res)
    }
    return res
  }

  function block(x, y) {
    return populate(x, y, 1)
  }

  function space(x, y) {
    return populate(x, y, 0)
  }

  function populate(dim_x, dim_y, value) {
    var res = new Array(dim_y)
    for (var y=0; y<dim_y; y++) {
      res[y] = new Array(dim_x)
      for (var x=0; x<dim_x; x++) {
        res[y][x] = value
      }
    }
    return res
  }

  function concat(compose) {
    return function() {
      if (arguments.length === 0) {
        return []
      }

      var last = arguments[0]
      for (var i = 1; i < arguments.length; i++) {
        var next = arguments[i]
        last = compose(last, next)
      }
      return last
    }
  }

  function compose_y(a, b) {
    var res = new Array(a.length + b.length)
    var y = 0
    for (var y1=0; y1<a.length; y1++) {
      res[y++] = a[y1]
    }
    for (var y2=0; y2<b.length; y2++) {
      res[y++] = b[y2]
    }
    return res
  }

  function compose_x(a, b) {
    var aRight = rotateRight(a)
    var bRight = rotateRight(b)
    var arOverBr = compose_y(aRight, bRight)
    return rotateLeft(arOverBr)
  }

}
