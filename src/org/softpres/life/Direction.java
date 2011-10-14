package org.softpres.life;

import java.util.ArrayList;
import java.util.List;

public enum Direction {

  TOP(0, -1),
  TOP_RIGHT(1, -1),
  RIGHT(1, 0),
  BOTTOM_RIGHT(1, 1),
  BOTTOM(0, 1),
  BOTTOM_LEFT(-1, 1),
  LEFT(-1, 0),
  TOP_LEFT(-1, -1);

  private final int xOffset;
  private final int yOffset;

  Direction(int xOffset, int yOffset) {
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }

  public Position get(Position position) {
    return new Position(
          position.getX() + xOffset,
          position.getY() + yOffset,
          position.getScale());
  }

}
