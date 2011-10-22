package org.softpres.life;

import java.awt.*;

/**
 * todo This is just here to remind me of this neat feature
 */
public class Individual {

  private static final Color[] AGES = new Color[10];
  private static final Color OLD_AGE;

  private boolean ages;
  private int age;
  private int ticker;
  private int lastAliveTick = Integer.MAX_VALUE;

  private boolean dead;

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

  public void draw(Graphics2D g) {
    final Color colour;
    if (dead) {
      colour = Color.DARK_GRAY;
    } else if (ages && Math.abs(ticker - lastAliveTick) <= 1) {
      colour = OLD_AGE;
    } else if (ages) {
      final int currentAge = Math.min(age, AGES.length - 1);
      colour = AGES[currentAge];
    } else {
      colour = Color.GREEN;
    }
    g.setColor(colour);
//    position.draw(g);
  }

  public void die() {
    age = 0;
  }

  public void tick() {
    ticker++;
    if (dead) {
      if (age != 0) {
        lastAliveTick = ticker;
      }
      age = 0;
    } else {
      age++;
    }
  }

}
