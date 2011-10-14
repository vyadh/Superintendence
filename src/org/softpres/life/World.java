package org.softpres.life;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.*;

public class World extends JPanel {

  private final Population population;
//  private final VolatileImage image;
  private final BufferedImage image;
  private final Timer timer;
  private boolean running = false;

  public World(Population population, int delay, int dimensionPixels) {
    this.population = population;
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

  public Population getPopulation() {
    return population;
  }

  public void tick() {
    population.tick();
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
      population.draw(g);
    }
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
