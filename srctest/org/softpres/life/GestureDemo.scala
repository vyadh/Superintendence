package org.softpres.life

import javax.swing.{JFrame, JPanel}

/**
 * Supports guesture-driven input.
 *
 * @author kieron
 */
object GestureDemo extends App {
  val p = new JPanel

  Gestures(p, g => println(g)).start()

  val f = new JFrame
  f.setContentPane(p)
  f.setSize(300, 300)
  f.setLocation(1000, 800)
  f.setVisible(true)

}
