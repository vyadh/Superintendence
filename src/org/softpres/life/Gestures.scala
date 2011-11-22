package org.softpres.life

import java.awt.event.{MouseMotionAdapter, MouseEvent, MouseAdapter}
import collection.mutable.ArrayBuffer
import java.awt.Component

/**
 * Supports guesture-driven input.
 *
 * @author kieron
 */
class Gestures(
      c: Component,
      listener: (Gestures.Point, Gestures.Gesture) => Unit = (_, _) => ()) {

  import Gestures._

  val granularity = 50 // ms
  var last: Position = null
  var vectors = new ArrayBuffer[Vector](100)


  def start() {
    c.addMouseListener(new MouseAdapter {
      override def mousePressed(e: MouseEvent) {
        gestureStart(e.getX, e.getY)
      }
      override def mouseReleased(e: MouseEvent) {
        gestureEnd(e.getX, e.getY)
      }
    })
    c.addMouseMotionListener(new MouseMotionAdapter {
      override def mouseDragged(e: MouseEvent) {
        gestureMove(e.getX, e.getY)
      }
    })
  }

  def gestureStart(x: Int, y: Int) {
    vectors.clear()
    last = Position(now, x, y)
  }

  def gestureMove(x: Int, y: Int) {
    val time = now
    if ((time - last.time) > granularity) {
      val pos = Position(time, x, y)
      emit(Vector(last, pos))
      last = pos
    }
  }

  def gestureEnd(x: Int, y: Int) {
    emit(Vector(last, Position(now, x, y)))
    val vectorList = vectors.toList

    val point = center(vectorList)

    val filtered = filterOp(vectorList)
    val path = aggregate(paths(filtered))

    listener(point, recognise(path))
  }

  def emit(vector: Vector) {
    vectors += vector

    // Might want to deliver vector to interested parties for "real time" updates
    // println(vector)
  }

  def now = System.nanoTime/1000000

  case class Position(time: Long, x: Int, y: Int)

  case class Vector(start: Position, end: Position) {
    def time = end.time - start.time
    def x = end.x - start.x
    def y = end.y - start.y

    def velocity = Velocity(magnitude, angle, direction)

    def magnitude = math.sqrt(math.pow(x, 2) + math.pow(y, 2))

    def angle: Double = {
      val zeroToTwoPi = math.atan2(y, x) + math.Pi
      val rotated = math.toDegrees(zeroToTwoPi) - 90
      if (rotated < 0) rotated + 360 else rotated
    }

    def direction = angle match {
      case a if slice(a,   0.0) => N
      case a if slice(a,  45.0) => NE
      case a if slice(a,  90.0) => E
      case a if slice(a, 135.0) => SE
      case a if slice(a, 180.0) => S
      case a if slice(a, 225.0) => SW
      case a if slice(a, 270.0) => W
      case a if slice(a, 315.0) => NW
      case a if slice(a, 360.0) => N
    }

    private def slice(angle: Double, around: Double) = between(angle, around-22.5, around+22.5)
    private def between(n: Double, min: Double, max: Double) = n >= min && n <= max

    override def toString = Seq(time, x, y, velocity).mkString("Vector(", ",", ")")
  }

  /** Filter out both points of changes in direction, and small unintended perpendicular drifts. */
  def filterOp(vectors: Seq[Vector]): Seq[Vector] = {
    val max = vectors.map(_.magnitude).max
    // Ignore anything under 20% of top speed
    vectors.filter(_.magnitude / max > 0.20)
  }

  def paths(vectors: Seq[Vector]) = vectors.map(_.direction)

  def aggregate(path: Seq[Direction]): List[Direction] = {
    if (path.isEmpty) {
      Nil
    } else {
      val current = path.head
      val rest = path.dropWhile(_ == current)
      current :: aggregate(rest)
    }
  }

  case class Velocity(magnitude: Double, angle: Double, direction: Direction) {
    override def toString = Seq(magnitude, direction).mkString("Velocity(", ",", ")")
  }

  def vectorise(positions: Seq[Position]): Seq[Vector] = {
    if (positions.isEmpty) {
      Seq()
    } else {
      positions.init.zip(positions.tail).map { case (s, e) => Vector(s, e) }
    }
  }

  /** Find the valleys in vector magnitude, usually being a change in direction. */
  def minima(nums: List[Vector]): List[Boolean] = {
    def process(nums: List[Vector], incLast: Boolean): List[Boolean] = {
      if (nums.isEmpty) return Nil
      if (nums.tail.isEmpty) return List(true) // Last is always minima

      val tail = nums.tail
      val curr = nums.head
      val next = tail.head
      val inc = next.magnitude > curr.magnitude
      val res = !incLast && inc // First increase after a non-increase

      res :: process(tail, inc)
    }

    process(nums, false) // First is always minima
  }


  // Gesture Analysis

  def recognise(path: List[Direction]) = path.size match {
    case 0 => Dot
    case 1 => Line(path.head) //todo but Dot, if magnitude is small (accidental mouse move on click)
    case 2 => Angle(path.head, path.drop(1).head)
    case 3 => gesture3(path.head, path.drop(1).head, path.drop(2).head)
    case n if n >= 6 && n <= 12 => circle(path).getOrElse(Complex(path))
    case _ => Complex(path)
  }

  def gesture3(a: Direction, b: Direction, c: Direction): Gesture = {
    if (a == c) return ZigZag(a, b, c)
    if (a == c.opposite) return U(a, b, c)
    Unknown(Seq(a, b, c))
  }

  def circle(path: Seq[Direction]): Option[Circle] = {
    if (path.size < 6) return None

    if (increasing(path)) {
      return Some(Circle(Clockwise))
    }
    if (decreasing(path)) {
      return Some(Circle(AntiClockwise))
    }

    None
  }


  // Utilities

  def directed(path: Seq[Direction])(p: Int => Boolean) =
    path.init.zip(path.tail).forall { case (a, b) => p(clockDist(a.order, b.order)) }
  def increasing(path: Seq[Direction]) = directed(path)(_ >= 0)
  def decreasing(path: Seq[Direction]) = directed(path)(_ <  0)

  /**
   * The distance between the two closest points on a clock.
   * Where a positive +ve value indicates clockwise, -ve is anti-clockwise.
   * A 'bump' is where "12 o'clock" is passed over.
   */
  def clockDist(a: Int, b: Int) = if (a <= b) {
    val (bump, norm) = ((8-b)+a, b-a)
    val distance = math.min(bump, norm)
    val sign = if (distance == norm) 1 else -1
    sign * distance
  } else {
    val (bump, norm) = ((8-a)+b, a-b)
    val distance = math.min(bump, norm)
    val sign = if (distance == norm) -1 else 1
    sign * distance
  }

  def center(vectors: List[Vector]): Point = {
    val xs = vectors.map(_.start.x) ++ vectors.map(_.end.x)
    val ys = vectors.map(_.start.y) ++ vectors.map(_.end.y)
    val x = mid(xs.min, xs.max)
    val y = mid(ys.min, ys.max)
    Point(x, y)
  }

  def mid(min: Int, max: Int) = min + (max-min)/2
}

object Gestures {

  def apply(c: Component, listener: (Point, Gesture) => Unit) = new Gestures(c, listener)

  sealed class Direction(val order: Int) {
    def opposite = this match {
      case N  => S
      case NE => SW
      case E  => W
      case SE => NW
      case S  => N
      case SW => NE
      case W  => E
      case NW => SE
      case _ => throw new IllegalArgumentException
    }
  }
  case object N  extends Direction(1)
  case object NE extends Direction(2)
  case object E  extends Direction(3)
  case object SE extends Direction(4)
  case object S  extends Direction(5)
  case object SW extends Direction(6)
  case object W  extends Direction(7)
  case object NW extends Direction(8)

  case class Point(x: Int, y: Int)

  trait Gesture
  case class Unknown(path: Seq[Direction]) extends Gesture
  case class Complex(path: Seq[Direction]) extends Gesture

  case object Dot extends Gesture
  case class Line   (dir: Direction) extends Gesture
  case class Angle  (a: Direction, b: Direction) extends Gesture
  case class ZigZag (a: Direction, b: Direction, c: Direction) extends Gesture
  case class U      (a: Direction, b: Direction, c: Direction) extends Gesture
  case class Circle (cd: ClockDirection) extends Gesture

  sealed trait ClockDirection
  case object Clockwise extends ClockDirection
  case object AntiClockwise extends ClockDirection

}
