package org.softpres.life;

import java.awt.*;

public class Individual implements Strategy {

  private static final Color[] AGES = new Color[10];
  private static final Color OLD_AGE;

  private final Strategy strategy;
  private final Position position;
  private int age;
  private int ticker;
  private int lastAliveTick = Integer.MAX_VALUE;


  static {
    Color c = Color.GREEN;
    final int scale = c.getGreen() / AGES.length;
    for (int i = 0; i < AGES.length; i++) {
      AGES[i] = c;
      final int newValue = Math.max(0, c.getGreen() - scale);
      c = new Color(c.getRed(), newValue, c.getBlue());
    }
    OLD_AGE = AGES[AGES.length - 1];
  }

  public Individual(Strategy strategy, Position position) {
    this.strategy = strategy;
    this.position = position;
  }

  public Position getPosition() {
    return position;
  }

//  public void attack(Individual individual) {
//    individual.attacked(this);
//  }

//  public void attacked(Individual individual) {
//    strategy.attacked(individual);
//  }

  public boolean isDead() {
    return strategy.isDead();
  }

  public void draw(Graphics2D g) {
    final Color colour;
    if (isDead()) {
      colour = Color.DARK_GRAY;
//    } else if (Math.abs(ticker - lastAliveTick) <= 1) {
//      colour = OLD_AGE;
    } else {
      final int currentAge = Math.min(age, AGES.length - 1);
//      colour = AGES[currentAge];
      colour = Color.GREEN;
    }
    g.setColor(colour);
    position.draw(g);
  }

  public String toString() {
    return strategy + ", " + position;
  }

  public Strategy revive() {
    return strategy.revive();
  }

  public Strategy die() {
    age = 0;
    return strategy.die();
  }

  public void tick() {
    ticker++;
    strategy.tick();
    if (strategy.isDead()) {
      if (age != 0) {
        lastAliveTick = ticker;
      }
      age = 0;
    } else {
      age++;
    }
  }

  public void update(Neighbourhood neighbourhood) {
    strategy.update(neighbourhood);
  }

}
