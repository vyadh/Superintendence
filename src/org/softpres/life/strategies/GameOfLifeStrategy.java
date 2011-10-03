package org.softpres.life.strategies;

import org.softpres.life.Strategy;
import org.softpres.life.Neighbourhood;

public class GameOfLifeStrategy implements Strategy {

  private boolean dead;
  private boolean willDie;

  public boolean isDead() {
    return dead;
  }

//    public void attacked(Individual individual) {
//      willDie = true;
//    }

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
    if (isDead() && count == 3) {
      revive();
    }
    if (count <= 1) {
      die();
    }
    if (count >= 4) {
      die();
    }
  }

  public void tick() {
    dead = willDie;
  }

  public String toString() {
    return getClass().getSimpleName();
  }
}
