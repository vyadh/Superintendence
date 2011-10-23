package org.softpres.life

import java.awt.{Color, Graphics2D}

/**
 * Scala GOL grid, post optimisation.
 * todo boundary grid
 *
 * MacBook:
 * 22300
 *
 * @author kieron
 */
class Grid(val dimX: Int, val dimY: Int) {

  val cellCount = dimX * dimY
  private var grid = new Array[Boolean](cellCount)
  private var dirty = new Dirty
  private var changes = new Changes
  private var painting: Array[(Int, Boolean)] = Array()


  final def tick() {
    step()
    commit()
  }

  final def commit() {
    val consumed = changes.consume()
    for ((index, alive) <- consumed) {
      grid(index) = alive
    }
    painting = consumed
  }

  final def cell(x: Int, y: Int): Boolean = {
    if (x <= 0 || x > dimX || y <= 0 || y > dimY) {
      return false
    }
    return grid(index(x, y))
  }

  final def prime(x: Int, y: Int, alive: Boolean) {
    changes += (index(x, y), alive)
    mark(x, y)
  }

  final def activate(x: Int, y: Int) {
    prime(x, y, true)
  }


  private def x(i: Int) = (i % dimX) + 1
  private def y(i: Int) = (i / dimX) + 1

  private def index(x: Int, y: Int) = (y - 1) * dimX + (x - 1)

  private def mark(x: Int, y: Int) {
    val minX = if (x == 1) 0 else -1
    val minY = if (y == 1) 0 else -1
    val maxX = if (x == dimX) 0 else 1
    val maxY = if (y == dimY) 0 else 1

    var xd = minX
    while (xd <= maxX) {
      var yd = minY
      while (yd <= maxY) {
        dirty += index(x+xd, y+yd)
        yd += 1
      }
      xd += 1
    }
  }

  private def step() {
    val current = dirty.consume()

    for (index <- current) {
      val x = this.x(index)
      val y = this.y(index)
      val before = cell(x, y)
      val n = neighbours(x, y)
      val after = alive(before, n)
      if (before != after) {
        prime(x, y, after)
      }
    }
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

  private def alive(alive: Boolean, neighbours: Int): Boolean = {
    if (alive) {
      if (neighbours <  2) return false
      if (neighbours <= 3) return true
    }
    else {
      return neighbours == 3
    }
    return false
  }

  final def draw(g: Graphics2D, scale: Int) {
    var i = 0
    while (i < painting.length) {
      val (index, alive) = painting(i)

      val colour = if (alive) Color.GREEN else Color.DARK_GRAY
      g.setColor(colour)

      val xp = x(index)
      val yp = y(index)
      val sx = scale * (xp - 1)
      val sy = scale * (yp - 1)

      g.fillRect(sx + 1, sy + 1, scale - 1, scale - 1)

      i += 1
    }
    painting = Array()
  }

  def count: Int = {
    var sum = 0
    for (cell <- grid) {
      sum += (if (cell) 1 else 0)
    }
    return sum
  }

  override def toString: String = {
    val rows = grid.sliding(dimX, dimX)
    def cell(alive: Boolean) = if (alive) "X" else "O"
    val strs = rows.map(_.map(cell).mkString)
    val res = strs.mkString("\n")
    res
  }

  class Changes {
    private val changes = new Array[Int](cellCount)
    private var length = 0

    def +=(index: Int, alive: Boolean) {
      changes(length) = encode(index, alive)
      length += 1
    }

    def encode(index: Int, alive: Boolean) = if (alive) index+cellCount else index
    def decode(value: Int) = if (value >= cellCount) (value-cellCount, true) else (value, false)

    def consume(): Array[(Int, Boolean)] = {
      val res = changes.take(length).map(decode) //todo optimise?
      length = 0
      res
    }
  }

  class Dirty {
    private var set = new Array[Boolean](cellCount)
    private val changes = new Array[Int](cellCount)
    private var length = 0
    def size = length

    def +=(index: Int) {
      if (!set(index)) {
        set(index) = true
        changes(length) = index
        length += 1
      }
    }

    def consume(): Array[Int] = {
      val res = changes.take(length+1) //todo optimise?
      set = new Array[Boolean](cellCount)
      length = 0
      res
    }
  }

}
