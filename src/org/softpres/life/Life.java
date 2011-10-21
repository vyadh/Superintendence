package org.softpres.life;

import org.softpres.life.strategies.*;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.lang.reflect.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class Life {

  public static final boolean BENCHMARK = false;

  private static final int DEFAULT_DIMENSION = 500;
  private static final int DEFAULT_SCALE = 2; // 2+
  private static final int DEFAULT_DELAY = 1000/60;

  private static final Random RANDOM = new Random();


  public static void main(String[] args) {
    if (BENCHMARK) {
      benchmark();
    } else {
      normal();
    }
  }

  private static void normal() {
//    final GridAPI grid = new OldGrid(DEFAULT_DIMENSION, DEFAULT_SCALE, population);
    final GridAPI grid = new Grid(DEFAULT_DIMENSION);
    final World world = new World(grid, DEFAULT_SCALE, DEFAULT_DELAY, DEFAULT_DIMENSION * DEFAULT_SCALE).start();

    final Life life = new Life();
    life.init(world, DEFAULT_SCALE);
  }

  private static void benchmark() {
    final int scale = 4;
    final int dimension = 100;
    final int delay = 0;

    System.out.println("Dimension (pixels): " + (dimension*scale));

//    final GridAPI grid = new OldGrid(dimension, scale, population);
    final GridAPI grid = new Grid(dimension);
    final World world = new World(grid, scale, delay, dimension * scale);

    randomise(grid, world, new Random(42));

    final Life life = new Life();
    life.createFrame(world);

    benchmark(world);
  }

  /**
   * Results. Format "e/t/r", where e=everything, t=ticks only, r=just repaint:
   *  55/  160/ 82 - volatile image
   *  70/  158/124 - buffered image
   *  81/  240/124 - added Direction#value() cache
   *  33/  113/100 - using scala dirty-optimised grid
   *  90/ 1350/100 - replaced for with while in Grid.mark()
   * 200/ 1350/215 - removed needless cell border drawing operation
   * 205/ 2070/220 - wasn't using optimised dirty-stepping!
   * 211/ 2070/220 - change list, and dirty regions activated
   * 890/62000/215 - drawing only change list!
   */
  private static void benchmark(final World world) {
    long ticks = 0;
    long start = System.currentTimeMillis();
    while (true) {
      final long now = System.currentTimeMillis();
      final long time = now-start;
      if (time >= 3000) {
        System.out.println("Executions/s: " + (ticks/(time/1000)));
        start = now;
        ticks = 0;
      }
      world.getGrid().tick();  // Disable to get 'r'
      benchmarkRepaint(world); // Disable to get 't'
      ticks++;
    }
  }

  private static void benchmarkRepaint(final World world) {
    world.update();
    try {
      EventQueue.invokeAndWait(new Runnable() {
        public void run() {
          world.repaint();
        }
      });
    } catch (InterruptedException e) {
      throw new IllegalStateException(e);
    } catch (InvocationTargetException e) {
      throw new IllegalStateException(e);
    }
  }

  private void init(final World world, final int scale) {
    final GridAPI grid = world.getGrid();

    world.addMouseListener(new MouseAdapter() {
      public void mousePressed(MouseEvent event) {
        toggleIndividual(event.getX() / scale, event.getY() / scale, grid);
        world.repaint();
      }
    });
    world.addMouseMotionListener(new MouseMotionAdapter() {
      private int lastX, lastY;

      public void mouseDragged(MouseEvent event) {
        final int x = event.getX() / scale;
        final int y = event.getY() / scale;
        if (x != lastX || y != lastY) {
          toggleIndividual(x, y, grid);
          lastX = x;
          lastY = y;
          world.repaint();
        }
      }
    });

    final JFrame frame = createFrame(world);
    frame.addKeyListener(new KeyAdapter() {
      public void keyTyped(KeyEvent event) {
        switch (event.getKeyChar()) {
          case ' ':
            world.pause();
            break;
          case 'r':
            randomise(grid, world);
            break;
          case 'f':
//            fill(grid, world);
            break;
          case 'c':
//            clear(grid, world);
            break;
          case 's':
            world.tick();
//            System.out.println(grid.alive() + ": " + grid.debug());
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

  private JFrame createFrame(World world) {
    final JFrame frame = new JFrame();
    frame.setLayout(new GridLayout(1, 1));
    frame.getContentPane().add(world);
    if (BENCHMARK) {
      frame.setLocation(2000, 1000); // Hidden!
    }
    frame.setVisible(true);
    frame.pack();
    frame.addWindowListener(new WindowAdapter() {
      public void windowClosing(WindowEvent event) {
        System.exit(0);
      }
    });
    return frame;
  }

  private static void toggleIndividual(int x, int y, GridAPI grid) {
    if (grid.cell(x, y)) {
      grid.prime(x, y, false);
    } else {
      grid.prime(x, y, true);
    }
    grid.tick();
  }

  private static void randomise(GridAPI grid, World world) {
    for (int x=1; x<=grid.dimension(); x++) {
      for (int y=1; y<=grid.dimension(); y++) {
        final boolean alive = RANDOM.nextBoolean();
        grid.prime(x, y, alive);
      }
    }
    grid.commit();
    world.update();
    world.repaint();
  }

  private static void randomise(GridAPI grid, World world, Random random) {
    for (int x=1; x<=grid.dimension(); x++) {
      for (int y=1; y<=grid.dimension(); y++) {
        final boolean alive = random.nextBoolean();
        grid.prime(x, y, alive);
      }
    }
    grid.commit();
    world.update();
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

  private static Population getInitialStateGlider(int size) {
    final Population population = getInitialStateAll(size);
    final JGrid grid = population.getGrid();
    grid.get(3, 1).revive().tick();
    grid.get(1, 2).revive().tick();
    grid.get(3, 2).revive().tick();
    grid.get(2, 3).revive().tick();
    grid.get(3, 3).revive().tick();
    return population;
  }

  private static Population getInitialStateAll(int size) {
    final List<Individual> individuals = new ArrayList<Individual>(size * size);
    for (int x=1; x<=size; x++) {
      for (int y=1; y<=size; y++) {
        final Individual individual =
              new Individual(new GameOfLifeStrategy(), new Position(x, y, DEFAULT_SCALE));
              new Individual(new ParetoRecuitmentStrategy(), new Position(x, y, DEFAULT_SCALE));
        individual.die().tick();
        individuals.add(individual);
      }
    }
    return new Population(size, individuals);
  }

}
