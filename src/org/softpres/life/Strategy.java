package org.softpres.life;

public interface Strategy {

  boolean isDead();

//  void threatened();

//  void attacked(Individual individual);

  Strategy die();

  Strategy revive();

  void tick();

  void update(Neighbourhood neighbourhood);
}
