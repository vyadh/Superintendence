package org.softpres.life;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;

public class World extends JPanel {

  private final Population population;
  private final BufferedImage image;
  private final Timer timer;
  private boolean running = false;

  public World(Population population) {
    this.population = population;
    image = new BufferedImage(
          Life.DIMENSION, Life.DIMENSION, BufferedImage.TYPE_INT_RGB);
    timer = new Timer(Life.DELAY, new ActionListener() {
      public void actionPerformed(ActionEvent event) {
        if (running) {
          tick();
        }
      }
    });
    timer.start();
  }

  public void tick() {
    population.tick();
    repaintInThread();
  }

  private void repaintInThread() {
    EventQueue.invokeLater(new Runnable() {
      public void run() {
        repaint();
      }
    });
  }

  public void repaint() {
    if (image != null) {
      final Graphics2D g = image.createGraphics();
      population.draw(g);
    }
    super.repaint();
  }

  protected void paintComponent(Graphics graphics) {
    super.paintComponent(graphics);
    final Graphics2D g = (Graphics2D)graphics;
    g.drawImage(image, null, 0, 0);
  }

  public Dimension getPreferredSize() {
    return new Dimension(Life.DIMENSION, Life.DIMENSION);
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
