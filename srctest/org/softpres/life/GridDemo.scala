package org.softpres.life

/**
 * Grid demo.
 *
 * Times, client/server
 *  1390/ 4630  original
 *    27/   66  start of dirty regions, but all updated
 *   170/  360  add code to collate dirty regions
 *   525/ 1330  replace mutable.Set dirty data structrure with dedicated
 * 26000/59100  only dirty regions evaluated!
 * 11400/27000  fixed algorithm bug
 * 12300/27000  purge + non-square grid
 * 16000/31000  avoid tuple creation, and subsequent boxing
 * 18000/37500  while loops
 * 19000/38300  final classes
 * 21700/48400  buffered array (dirty)
 * 22800/52000  buffered array (changes)
 *
 * Mac:
 *    na/22000  mac continued from above
 *    na/24700  no changes?
 *
 * @author kieron
 */
object GridDemo {

  def main(args: Array[String]): Unit = {
//    val grid = new GridAll(10)
    val grid = new Grid(100, 100)
    activatePseudoRandom(grid)
//    activateGlider(grid)
    grid.commit()

//    println(grid)
//    println()
//    grid.tick()
//    println(grid)

//    for (_ <- 1 to 5) time(10000) { grid.tick() }
    timePerSecond { grid.tick() }
//    print(grid)
  }

  private def activatePseudoRandom(grid: Grid) {
    val random = new java.util.Random(42)
    for (x <- 1 to grid.dimX; y <- 1 to grid.dimY) {
      if (random.nextBoolean) {
        grid.activate(x, y)
      }
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
