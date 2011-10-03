package org.softpres.life;

import java.util.List;

public class Neighbourhood {

  private final List<Individual> neighbours;

  public Neighbourhood(List<Individual> neighbours) {
    this.neighbours = neighbours;
  }

  public int count() {
    return neighbours.size();
  }

}
