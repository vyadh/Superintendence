package org.softpres.life;

import java.awt.*;

public class Position {

  private int x;
  private int y;
  private final int scale;

  public Position(int x, int y, int scale) {
    this.x = x;
    this.y = y;
    this.scale = scale;
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public int getScale() {
    return scale;
  }

  public void draw(Graphics2D g) {
    final int sx = scale * x;
    final int sy = scale * y;
    g.fillRect(sx + 1, sy + 1, scale - 1, scale - 1);
    if (scale > 1) {
      g.setColor(Color.BLACK);
      g.drawRect(sx, sy, scale, scale);
    }
  }

  public String toString() {
    return Integer.toString(x) + ',' + Integer.toString(y);
  }
}
