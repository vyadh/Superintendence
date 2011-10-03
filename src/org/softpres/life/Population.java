package org.softpres.life;

import java.util.*;
import java.awt.*;
import java.util.List;

public class Population {

  private final List<Individual> individuals;
  private final JGrid grid;
  private final Random random;

  public Population(List<Individual> individuals) {
    this.individuals = individuals;
    grid = new JGrid(individuals);
    random = new Random();
  }

  public Individual next() {
    final int rand = random.nextInt(individuals.size());
    return individuals.get(rand);
  }

  public void draw(Graphics2D g) {
    for (final Individual individual : individuals) {
      individual.draw(g);
    }
  }

  public void tick() {
    for (final Individual individual : individuals) {
      final Neighbourhood neighbourhood = grid.getNeighbourhood(individual);
      individual.update(neighbourhood);
    }
    for (final Individual individual : individuals) {
      individual.tick();
    }
  }

  public int alive() {
    int result = 0;
    for (Individual individual : individuals) {
      if (!individual.isDead()) {
        result++;
      }
    }
    return result;
  }

  public String debug() {
    List<String> collect = new ArrayList<String>();
    for (Individual individual : individuals) {
      if (!individual.isDead()) {
        collect.add(individual.getPosition().toString());
      }
    }
    Collections.sort(collect);

    StringBuffer sb = new StringBuffer();
    for (String s : collect) {
      sb.append('(' + s + "), ");
    }
    return sb.toString();
  }

  public JGrid getGrid() {
    return grid;
  }

  public List<Individual> getIndividuals() {
    return individuals;
  }
}
