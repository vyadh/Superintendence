package org.softpres.life

/**
 * Grid demo.
 *
 * @author kieron
 */
object GridDemo {

  def main(args: Array[String]): Unit = {
    val grid = new Grid(100)
    activatePseudoRandom(grid)
//    activateGlider(grid)

//    for (_ <- 1 to 5) time(10000) { grid.tick() }
    timePerSecond { grid.tick() }
//    print(grid)
  }

  private def activateGlider(grid: Grid) {
    grid.activate(1, 2)
    grid.activate(2, 3)
    grid.activate(3, 1)
    grid.activate(3, 2)
    grid.activate(3, 3)
  }

  private def activatePseudoRandom(grid: Grid) {
    val random = new java.util.Random(42)
    import grid.dimension
    for (x <- 1 to dimension; y <- 1 to dimension) {
      if (random.nextBoolean) {
        grid.activate(x, y)
      }
    }
  }


  private def print(grid: Grid): Unit = {
    System.out.println(grid)
    for (_ <- 1 to 20) {
      grid.tick()
      println(grid.count + ": " + grid)
    }
  }

  private def time(count: Int)(block: => Unit) {
    val start = System.currentTimeMillis
    var i = 1
    while (i <= count) {
      block
      i += 1
    }
    val end = System.currentTimeMillis
    System.out.println(end - start)
  }

  private def timePerSecond(block: => Unit) {
    var executions = 0L
    var start = System.currentTimeMillis

    while (true) {
      val now: Long = System.currentTimeMillis
      val time: Long = now - start
      if (time >= 3000) {
        System.out.println("Executions/s: " + (executions / (time / 1000)))
        start = now
        executions = 0
      }
      block
      executions += 1
    }
  }

}
