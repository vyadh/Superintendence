package org.softpres.life

/**
 * Scala GOL grid, post optimisation.
 *
 * @author kieron
 */
class Grid(val dimension: Int) {

  private var grid = new Array[Boolean](dimension * dimension)
  private var buffer = new Array[Boolean](dimension * dimension)

  private def swap() {
    val tmp = grid
    grid = buffer
    buffer = tmp
  }

  private def x(i: Int) = (i % dimension) + 1
  private def y(i: Int) = (i / dimension) + 1

  private def index(x: Int, y: Int) = (y - 1) * dimension + (x - 1)

  private def cell(x: Int, y: Int): Boolean = {
    if (x <= 0 || x > dimension || y <= 0 || y > dimension) {
      return false
    }
    return grid(index(x, y))
  }

  private def prime(x: Int, y: Int, alive: Boolean) {
    buffer(index(x, y)) = alive
  }

  def activate(x: Int, y: Int) {
    grid(index(x, y)) = true
  }

  private def neighbours(x: Int, y: Int): Int = {
    return neighbour(x, y, -1, -1) +
           neighbour(x, y, -1,  0) +
           neighbour(x, y, -1,  1) +
           neighbour(x, y,  0, -1) +
           neighbour(x, y,  0,  1) +
           neighbour(x, y,  1, -1) +
           neighbour(x, y,  1,  0) +
           neighbour(x, y,  1,  1)
  }

  private def neighbour(x: Int, y: Int, xd: Int, yd: Int): Int = {
    return if (cell(x + xd, y + yd)) 1 else 0
  }

  final def tick() {
    var y = 1
    while (y <= dimension) {
      var x = 1
      while (x <= dimension) {
        val before = cell(x, y)
        val n = neighbours(x, y)
        val after = alive(before, n)
        prime(x, y, after)
        x += 1
      }
      y += 1
    }
    swap
  }

  private def alive(alive: Boolean, neighbours: Int): Boolean = {
    if (alive) {
      if (neighbours <  2) return false
      if (neighbours <= 4) return true
    }
    else {
      return neighbours == 3
    }
    return false
  }

  def count: Int = {
    var sum = 0
    for (cell <- grid) {
      sum += (if (cell) 1 else 0)
    }
    return sum
  }

  override def toString: String = {
    val coords = for {
      x <- 1 to dimension
      y <- 1 to dimension
      if cell(x, y)
    } yield x + "," + y

    coords.sorted.mkString("(", "), (", ")")
  }

}
