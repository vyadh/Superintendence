package org.softpres.life;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.*;

public class World extends JPanel {

  private final GridAPI grid;
  private final int scale;
  //  private final VolatileImage image;
  private final BufferedImage image;
  private final Timer timer;
  private boolean running = false;

  public World(GridAPI grid, int scale, int delay, int dimensionPixels) {
    this.grid = grid;
    this.scale = scale;
//    image = imageVolatile(dimensionPixels, dimensionPixels);
    image = imageBuffered(dimensionPixels, dimensionPixels);
    timer = new Timer(delay, new ActionListener() {
      public void actionPerformed(ActionEvent event) {
        if (running) {
          tick();
        }
      }
    });
  }

  public World start() {
    timer.start();
    return this;
  }

  private VolatileImage imageVolatile(int width, int height) {
    final GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
    final GraphicsConfiguration gc = ge.getDefaultScreenDevice().getDefaultConfiguration();
    return gc.createCompatibleVolatileImage(width, height, Transparency.OPAQUE);
  }

  private BufferedImage imageBuffered(int width, int height) {
    final GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
    final GraphicsConfiguration gc = ge.getDefaultScreenDevice().getDefaultConfiguration();
    return gc.createCompatibleImage(width, height, Transparency.OPAQUE);
  }

  public GridAPI getGrid() {
    return grid;
  }

  public void tick() {
    grid.tick();
    update();
    repaintInThread();
  }

  private void repaintInThread() {
    EventQueue.invokeLater(new Runnable() {
      public void run() {
        repaint();
      }
    });
  }

  public void update() {
    if (image != null) {
      final Graphics2D g = image.createGraphics();
      draw(g, grid);
    }
  }

  private void draw(Graphics2D g, GridAPI grid) {
    grid.draw(g, scale);
//    for (int x=1; x<=grid.dimension(); x++) {
//      for (int y=1; y<=grid.dimension(); y++) {
//        draw(g, x, y, grid.cell(x, y));
//      }
//    }
  }

  private void draw(Graphics2D g, int x, int y, boolean alive) {
    final Color colour;
    if (alive) {
      colour = Color.GREEN;
    } else {
      colour = Color.DARK_GRAY;
    }
    g.setColor(colour);

    final int sx = scale * (x - 1);
    final int sy = scale * (y - 1);
    g.fillRect(sx + 1, sy + 1, scale - 1, scale - 1);
  }

  protected void paintComponent(Graphics graphics) {
    super.paintComponent(graphics);

    final Graphics2D g = (Graphics2D)graphics;
    g.drawImage(image, 0, 0, null);
    g.dispose();
  }

  public Dimension getPreferredSize() {
    return new Dimension(image.getWidth(), image.getHeight());
  }

  public void pause() {
    running = !running;
  }

  public void speedUp() {
    int newDelay = timer.getDelay() - 20;
    if (newDelay < 0) newDelay = 0;
    timer.setDelay(newDelay);
  }

  public void slowDown() {
    timer.setDelay(timer.getDelay() + 20);
  }

}
