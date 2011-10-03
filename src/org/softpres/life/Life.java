package org.softpres.life;

import org.softpres.life.strategies.*;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Life {

  public static final int SIZE = 100;
  public static final int COUNT = SIZE * SIZE;
  public static final int SCALE = 6; // 2+
  public static final int DIMENSION = SIZE * SCALE;
  public static final int DELAY = 100;

  private static final Random RANDOM = new Random();


  public static void main(String[] args) {
    new Life().init();
  }

  private void init() {
    final Population population = getInitialStateGlider();
//    final Population population = getInitialStateRandom();
//    final Population population = getInitialStateAll();
    final World world = new World(population);

    world.addMouseListener(new MouseAdapter() {
      public void mousePressed(MouseEvent event) {
        toggleIndividual(event.getX() / SCALE, event.getY() / SCALE, population);
        world.repaint();
      }
    });
    world.addMouseMotionListener(new MouseMotionAdapter() {
      private int lastX, lastY;
      public void mouseDragged(MouseEvent event) {
        final int x = event.getX() / SCALE;
        final int y = event.getY() / SCALE;
        if (x != lastX || y != lastY) {
           toggleIndividual(x, y, population);
          lastX = x;
          lastY = y;
          world.repaint();
        }
      }
    });
    final JFrame frame = new JFrame();
    frame.setLayout(new GridLayout(1, 1));
    frame.getContentPane().add(world);
    frame.setVisible(true);
    frame.pack();
    frame.addWindowListener(new WindowAdapter() {
      public void windowClosing(WindowEvent event) {
        System.exit(0);
      }
    });
    frame.addKeyListener(new KeyAdapter() {
      public void keyTyped(KeyEvent event) {
        switch (event.getKeyChar()) {
          case ' ':
            world.pause();
            break;
          case 'r':
            randomise(population, world);
            break;
          case 'f':
            fill(population, world);
            break;
          case 'c':
            clear(population, world);
            break;
          case 's':
            world.tick();
            System.out.println(population.alive() + ": " + population.debug());
            break;
          case 'q':
            System.exit(0);
            break;
          case '+':
            world.speedUp();
            break;
          case '-':
            world.slowDown();
            break;
        }
      }
    });

  }

  private static void toggleIndividual(int x, int y, Population population) {
    final Individual i = population.getGrid().get(new Position(x, y));
    if (i.isDead()) {
      i.revive();
    } else {
      i.die();
    }
    i.tick();
  }

  private static void randomise(Population population, World world) {
    final List<Individual> individuals = population.getIndividuals();
    for (final Individual individual : individuals) {
      if (RANDOM.nextBoolean()) {
        individual.die();
      } else {
        individual.revive();
      }
      individual.tick();
    }
    world.repaint();
  }

  private static void fill(Population population, World world) {
    final List<Individual> individuals = population.getIndividuals();
    for (final Individual individual : individuals) {
      individual.revive();
      individual.tick();
    }
    world.repaint();
  }

  private static void clear(Population population, World world) {
    final List<Individual> individuals = population.getIndividuals();
    for (final Individual individual : individuals) {
      individual.die();
      individual.tick();
    }
    world.repaint();
  }

  private static Population getInitialStateGlider() {
    final Population population = getInitialStateAll();
    final JGrid grid = population.getGrid();
//    grid.get(new Position(2, 1)).revive().tick();
//    grid.get(new Position(3, 2)).revive().tick();
//    grid.get(new Position(1, 3)).revive().tick();
//    grid.get(new Position(2, 3)).revive().tick();
//    grid.get(new Position(3, 3)).revive().tick();
    grid.get(new Position(3, 1)).revive().tick();
    grid.get(new Position(1, 2)).revive().tick();
    grid.get(new Position(3, 2)).revive().tick();
    grid.get(new Position(2, 3)).revive().tick();
    grid.get(new Position(3, 3)).revive().tick();
    return population;
  }

  private static Population getInitialStateAll() {
    final List<Individual> individuals = new ArrayList<Individual>(COUNT);
    for (int x=1; x<=SIZE; x++) {
      for (int y=1; y<=SIZE; y++) {
        final Individual individual =
//              new Individual(new GameOfLifeStrategy(), new Position(x, y));
              new Individual(new ParetoRecuitmentStrategy(), new Position(x, y));
        individual.die().tick();
        individuals.add(individual);
      }
    }
    return new Population(individuals);
  }

}
