class Powerup {
  constructor(pos) {
    this.pos = {
      x: pos.x,
      y: pos.y
    };
    this.die = false;
    this.id = null;
    this.radius = 10;
  }

  isCollision(pos, radius) {
    const distance = Math.sqrt(Math.pow(this.pos.x - pos.x, 2) + Math.pow(this.pos.y - pos.y, 2));
    return distance < radius + this.radius;
  }

  effect(e){}

  simplify() {
    return `P${this.id} ${this.pos.x} ${this.pos.y}`;
  }
}

class LifePowerup extends Powerup {
  constructor(pos) {
    super(pos);
    this.id = 'H';
  }

  effect(player) {
    if (player.health < 10) player.health++;
  }
}

class TimePowerup extends Powerup {
  constructor(pos) {
    super(pos);
    this.id = 'T';
  }

  effect(time) {
    time.value = true;
    setTimeout(() => {
      time.value = false;
    }, 10000);
  }
}

class ShootPowerup extends Powerup {
  constructor(pos) {
    super(pos);
    this.id = 'S';
  }

  effect(player) {
    player.cooldownTime -= 20;
  }
}

class TurnPowerup extends Powerup {
  constructor(pos) {
    super(pos);
    this.id = 'U';
  }

  effect(player) {
    player.turnSpeed += 0.01;
  }
}

module.exports = {
  LifePowerup: LifePowerup,
  TimePowerup: TimePowerup,
  ShootPowerup: ShootPowerup,
  TurnPowerup: TurnPowerup
};