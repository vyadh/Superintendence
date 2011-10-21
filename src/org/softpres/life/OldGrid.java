/*
 * Copyright:    Copyright (c) 2011
 * Company:      Pareto Investment Management Limited
 */

package org.softpres.life;

import java.awt.*;

/**
 * todo Description
 *
 * @author kieron
 */
public class OldGrid implements GridAPI {

  private final int dimension;
  private final int scale;
  private final Population population;

  public OldGrid(int dimension, int scale, Population population) {
    this.dimension = dimension;
    this.scale = scale;
    this.population = population;
  }

  public void prime(int x, int y, boolean alive) {
    final Individual i = population.getGrid().get(new Position(x, y, scale));
    if (alive) {
      i.die();
    } else {
      i.revive();
    }
    i.tick();//todo?
  }

  public void activate(int x, int y) {
    population.getGrid().get(x, y).revive();
    population.getGrid().get(x, y).tick();
  }

  public void tick() {
    for (Individual individual : population.getIndividuals()) {
      individual.tick();
    }
  }

  public int dimension() {
    return dimension;
  }

  public boolean cell(int x, int y) {
    return !population.getGrid().get(x, y).isDead();
  }

  public void commit() {
//    population.next();
  }

  public void draw(Graphics2D g, int scale) {
  }
}
