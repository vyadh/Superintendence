package org.softpres.life;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.lang.reflect.*;
import java.util.Random;

public class Life {

  public static final boolean BENCHMARK = false;

  private static final int PIXELS_X = 1260;
  private static final int PIXELS_Y = 750;
  private static final int CELL_DIM = 2; // 2+
  private static final int FPS = 60;

  private static final int DEFAULT_DIMENSION_X = PIXELS_X/CELL_DIM;
  private static final int DEFAULT_DIMENSION_Y = PIXELS_Y/CELL_DIM;
  private static final int DEFAULT_DELAY = 1000/FPS;

  private static final Random RANDOM = new Random();

  private final World world;
  private final Grid grid;

  public Life(World world, Grid grid) {
    this.world = world;
    this.grid = grid;
  }


  public static void main(String[] args) {
    if (BENCHMARK) {
      benchmark();
    } else {
      normal();
    }
  }

  private static void normal() {
//    final Grid grid = new OldGrid(DEFAULT_DIMENSION, DEFAULT_SCALE, population);
    final Grid grid = new Grid(DEFAULT_DIMENSION_X, DEFAULT_DIMENSION_Y);
    final World world = new World(
          grid,
          CELL_DIM,
          DEFAULT_DELAY,
          DEFAULT_DIMENSION_X * CELL_DIM,
          DEFAULT_DIMENSION_Y * CELL_DIM
    ).start();

    final Life life = new Life(world, grid);
    life.init(CELL_DIM);
  }

  private static void benchmark() {
    final int scale = 4;
    final int dimension = 500;
    final int delay = 0;

    System.out.println("Dimension (pixels): " + (dimension*scale));

//    final Grid grid = new OldGrid(dimension, scale, population);
    final Grid grid = new Grid(dimension, dimension);
    final World world = new World(grid, scale, delay, dimension * scale, dimension * scale);

    final Life life = new Life(world, grid);
    life.randomise(new Random(42));
    life.createFrame();

    benchmark(world);
  }

  /**
   * Results (server). Format "e/t/r", where e=everything, t=ticks only, r=just repaint:
   *   55/  160/  82 - volatile image
   *   70/  158/ 124 - buffered image
   *   81/  240/ 124 - added Direction#value() cache
   *   33/  113/ 100 - using scala dirty-optimised grid
   *   90/ 1350/ 100 - replaced for with while in Grid.mark()
   *  200/ 1350/ 215 - removed needless cell border drawing operation
   *  205/ 2070/ 220 - wasn't using optimised dirty-stepping!
   *  211/ 2070/ 220 - change list, and dirty regions activated
   *  890/62000/ 215 - drawing only change list!
   *  890/28300/2200 - fixed algorithm bug + small stuff (not sure why repaint has changed so much)
   *  900/30500/2200 - avoid tuple creation, and subsequent boxing
   *   58/ 1100/ 157 - adjusted benchmark grid size to 500x500
   *   59/ 1850/ 157 - while loops, buffered array use
   *  151/ 1820/ 157 - volatile image
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

  private void init(final int scale) {
    world.addMouseListener(new MouseAdapter() {
      public void mousePressed(MouseEvent event) {
        final int x = event.getX() / scale + 1;
        final int y = event.getY() / scale + 1;
        toggle(x, y);
      }
    });
    world.addMouseMotionListener(new MouseMotionAdapter() {
      private int lastX, lastY;

      public void mouseDragged(MouseEvent event) {
        final int x = event.getX() / scale + 1;
        final int y = event.getY() / scale + 1;
        if (x != lastX || y != lastY) {
          toggle(x, y);
          lastX = x;
          lastY = y;
        }
      }
    });

    final JFrame frame = createFrame();
    frame.addKeyListener(new KeyAdapter() {
      public void keyTyped(KeyEvent event) {
        switch (event.getKeyChar()) {
          // Actions
          case ' ': world.pause(); break;
          case 's': world.tick(); break;
          case 'r': randomise(); break;
          case '-': world.slowDown(); break;
          case '+': case '=': world.speedUp(); break;
          case 'c': clear(); break;
          case 'q': System.exit(0); break;

          // Patterns
          case 'a': acorn(); break;
          case 'l': line(); break;
          case 'g': glider(); break;
        }
      }
    });

  }

  private JFrame createFrame() {
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

  private void toggle(int x, int y) {
    grid.prime(x, y, !grid.cell(x, y));
    grid.commit();
    world.update();
    world.repaint();
  }

  private void line() {
    final int y = grid.dimY() / 2;
    for (int x=1; x<=grid.dimX(); x++) {
      grid.activate(x, y);
    }

    grid.commit();
    world.update();
    world.repaint();
  }

  private void acorn() {
    final int x = grid.dimX() / 2;
    final int y = grid.dimY() / 2;

    grid.activate(x + 3, y + 2);
    grid.activate(x + 2, y + 4);
    grid.activate(x + 3, y + 4);
    grid.activate(x + 5, y + 3);
    grid.activate(x + 6, y + 4);
    grid.activate(x + 7, y + 4);
    grid.activate(x + 8, y + 4);

    grid.commit();
    world.update();
    world.repaint();
  }

  private void glider() {
    grid.activate(3, 1);
    grid.activate(1, 2);
    grid.activate(3, 2);
    grid.activate(2, 3);
    grid.activate(3, 3);

    grid.commit();
    world.update();
    world.repaint();
  }

  private void randomise() {
    randomise(RANDOM);
  }

  private void randomise(Random random) {
    for (int x=1; x<=grid.dimX(); x++) {
      for (int y=1; y<=grid.dimY(); y++) {
        final boolean alive = random.nextBoolean();
        grid.prime(x, y, alive);
      }
    }
    grid.commit();
    world.update();
    world.repaint();
  }

  private void clear() {
    for (int x=1; x<=grid.dimX(); x++) {
      for (int y=1; y<=grid.dimY(); y++) {
        grid.prime(x, y, false);
      }
    }
    grid.commit();
    world.clear();
    world.repaint();
  }

}
