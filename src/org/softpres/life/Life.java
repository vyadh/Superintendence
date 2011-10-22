package org.softpres.life;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.lang.reflect.*;
import java.util.Random;

public class Life {

  public static final boolean BENCHMARK = false;

  private static final int DEFAULT_DIMENSION = 250;
  private static final int DEFAULT_SCALE = 3; // 2+
  private static final int DEFAULT_DELAY = 1000/60;

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
    final Grid grid = new Grid(DEFAULT_DIMENSION);
    final World world = new World(grid, DEFAULT_SCALE, DEFAULT_DELAY, DEFAULT_DIMENSION * DEFAULT_SCALE).start();

    final Life life = new Life(world, grid);
    life.init(DEFAULT_SCALE);
  }

  private static void benchmark() {
    final int scale = 4;
    final int dimension = 100;
    final int delay = 0;

    System.out.println("Dimension (pixels): " + (dimension*scale));

//    final Grid grid = new OldGrid(dimension, scale, population);
    final Grid grid = new Grid(dimension);
    final World world = new World(grid, scale, delay, dimension * scale);

    final Life life = new Life(world, grid);
    life.randomise(new Random(42));
    life.createFrame();

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
    final int y = grid.dimension() / 2;
    for (int x=1; x<=grid.dimension(); x++) {
      grid.activate(x, y);
    }

    grid.commit();
    world.update();
    world.repaint();
  }

  private void acorn() {
    final int x = grid.dimension() / 2;
    final int y = grid.dimension() / 2;

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

  private void randomise(Random random) {
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

  private void clear() {
    for (int x=1; x<=grid.dimension(); x++) {
      for (int y=1; y<=grid.dimension(); y++) {
        grid.prime(x, y, false);
      }
    }
    grid.commit();
    world.clear();
    world.repaint();
  }

}
