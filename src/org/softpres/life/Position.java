package org.softpres.life;

import java.awt.*;

public class Position {

  private int x;
  private int y;

  public Position(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public int getX() {
    return x;
  }

  public int getY() {
    return y;
  }

  public void draw(Graphics2D g) {
    final int sx = Life.SCALE * x;
    final int sy = Life.SCALE * y;
    g.fillRect(sx + 1, sy + 1, Life.SCALE - 1, Life.SCALE - 1);
    if (Life.SCALE > 1) {
      g.setColor(Color.BLACK);
      g.drawRect(sx, sy, Life.SCALE, Life.SCALE);
    }
  }

  public String toString() {
    return Integer.toString(x) + ',' + Integer.toString(y);
  }
}
