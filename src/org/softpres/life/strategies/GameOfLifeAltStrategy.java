package org.softpres.life.strategies;

import org.softpres.life.*;

public class GameOfLifeAltStrategy implements Strategy {

  private boolean dead;
  private boolean willDie;

  public boolean isDead() {
    return dead;
  }

  public Strategy die() {
    willDie = true;
    return this;
  }

  public Strategy revive() {
    willDie = false;
    return this;
  }

  public void update(Neighbourhood neighbourhood) {
    final int count = neighbourhood.count();
    if (isDead()) {
      if (count == 3) {
        revive();
      }
    } else {
      if (count < 2 || count > 3) {
        die();
      }
    }
  }

  public void tick() {
    dead = willDie;
  }

  public String toString() {
    return getClass().getSimpleName();
  }
}
