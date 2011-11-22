package org.softpres.life

import javax.swing.{JFrame, JPanel}

/**
 * Supports guesture-driven input.
 *
 * @author kieron
 */
object GestureDemo extends App {
  
  val c = new JPanel

  Gestures(c, (p, g) => println(p + ": " + g)).start()

  val f = new JFrame
  f.setContentPane(c)
  f.setSize(300, 300)
  f.setLocation(1000, 800)
  f.setVisible(true)

}
