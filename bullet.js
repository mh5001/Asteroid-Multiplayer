const settings = require('./settings.json');

class Bullet {
  constructor(pos, angle) {
    this.pos = {
      x: pos.x,
      y: pos.y
    };
    this.vector = {
      x: Math.cos(angle) * settings.BULLET_SPEED,
      y: Math.sin(angle) * settings.BULLET_SPEED
    };
    this.die = false;
    this.radius = settings.BULLET_RAD;
  }

  simplify() {
    return `B ${this.pos.x} ${this.pos.y}`;
  }

  update() {
    this.pos.x += this.vector.x;
    this.pos.y += this.vector.y;

    if (this.pos.x <= -this.radius || this.pos.x >= settings.WIDTH + this.radius) this.die = true;
    if (this.pos.y <= -this.radius || this.pos.y >= settings.HEIGHT + this.radius) this.die = true;
  }
}

module.exports = Bullet;