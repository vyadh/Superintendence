package org.softpres.life;

import java.awt.*;

/**
 * todo Description
 *
 * @author kieron
 */
public interface GridAPI {

  void tick();

  int dimension();

  boolean cell(int x, int y);

  void activate(int x, int y);

  void commit();

  void prime(int x, int y, boolean alive);

  void draw(Graphics2D g, int scale);
}
