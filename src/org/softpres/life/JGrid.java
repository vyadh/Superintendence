package org.softpres.life;

import java.util.List;
import java.util.ArrayList;

public class JGrid {

  private final Individual[][] grid;
  private final Direction[] directions = Direction.values();

  public JGrid(int size, List<Individual> individuals) {
    grid = new Individual[size][size];
    initialiseGrid(individuals);
  }

  private void initialiseGrid(List<Individual> individuals) {
    for (final Individual individual : individuals) {
      final Position position = individual.getPosition();
      grid[position.getX()-1][position.getY()-1] = individual;
    }
//    for (int x=0; x<Life.SIZE; x++) {
//      for (int y=0; y<Life.SIZE; y++) {
//        grid[x][y] = Individual.NONE;
//      }
//    }
  }

  public Neighbourhood getNeighbourhood(Individual individual) {
    final List<Individual> neighbours = new ArrayList<Individual>(8);
    for (final Direction direction : directions) {
      final Position position = direction.get(individual.getPosition());
      if (isInBounds(position)) {
        final Individual neighbour = get(position);
        if (neighbour != null && !neighbour.isDead()) {
          neighbours.add(neighbour);
        }
      }
    }
    return new Neighbourhood(neighbours);
  }

  public boolean isInBounds(Position position) {
    final int x = position.getX()-1;
    final int y = position.getY()-1;
    return x >= 0 && x < grid.length &&
          y >= 0 && y < grid.length; // both sides the same
  }

  public Individual get(Position position) {
    return get(position.getX(), position.getY());
  }

  public Individual get(int x, int y) {
    return grid[x-1][y-1];
  }

}
