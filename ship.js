const settings = require('./settings.json');

class Ship {
  constructor (id) {
    this.id = id;
    this.pos = {
      x: settings.WIDTH / 2,
      y: settings.HEIGHT / 2
    };
    this.maxSpeed = 5; // Prev was 5
    this.turnSpeed = 0.05; // Prev was 0.05

    this.turnDirection = 0;
    this.direction = 0;

    this.velocity = {
      x: 0,
      y: 0
    }
    this.color = `rgba(${Math.round(Math.random() * 100) + 50},${Math.round(Math.random() * 100) + 50},${Math.round(Math.random() * 100) + 50},1)`;
    this.angle = 0;
    this.health = 3;
    this.invulnerable = true;
    setTimeout(() => {
      this.invulnerable = false;
    }, 2000);

    this.isShooting = false;
    this.cooldownTime = settings.SHOOT_COOLDOWN;
    this.shootCooldown = 0;
  }

  simplify() {
    return `S ${this.id} ${this.pos.x} ${this.pos.y} ${this.angle} ${this.color} ${this.health} ${this.direction} ${this.invulnerable}`;
    //      0      1            2             3             4             5             6               7                   8
  }

  move(direction) {
    this.velocity = {
      x: Math.cos(this.angle) * this.maxSpeed * direction,
      y: Math.sin(this.angle) * this.maxSpeed * direction
    };
    this.direction = direction;
  }
  turn(turnDirection) {
    this.angle += this.turnSpeed * turnDirection;
    if (this.angle >= 2 * Math.PI) this.angle %= 2 * Math.PI;
    this.turnDirection = turnDirection;
  }

  update() {
    if (!this.velocity.x && !this.velocity.y) return;

    if (this.pos.x < settings.SHIP_RAD) {
      this.velocity.x = 0;
      this.pos.x = settings.SHIP_RAD;
    }
    if (this.pos.x > settings.WIDTH - settings.SHIP_RAD) {
      this.velocity.x = 0;
      this.pos.x = settings.WIDTH - settings.SHIP_RAD;
    }
    if (this.pos.y < settings.SHIP_RAD) {
      this.velocity.y = 0;
      this.pos.y = settings.SHIP_RAD;
    }
    if (this.pos.y > settings.HEIGHT - settings.SHIP_RAD) {
      this.velocity.y = 0;
      this.pos.y = settings.HEIGHT - settings.SHIP_RAD;
    }
    
    if (this.pos.x === settings.SHIP_RAD && this.velocity.x < 0) this.velocity.x = 0;
    if (this.pos.x === settings.WIDTH - settings.SHIP_RAD && this.velocity.x > 0) this.velocity.x = 0;
    if (this.pos.y === settings.SHIP_RAD && this.velocity.y < 0) this.velocity.y = 0;
    if (this.pos.y === settings.HEIGHT - settings.SHIP_RAD && this.velocity.y > 0) this.velocity.y = 0;
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    
    if (!this.direction) {
      if (Math.abs(this.velocity.x) <= 0.1 && Math.abs(this.velocity.y) <= 0.1) {
        this.velocity.x = 0;
        this.velocity.y = 0;
      }
      this.velocity.x *= 0.95;
      this.velocity.y *= 0.95;
    } else this.move(this.direction);

    if (this.turnDirection) this.turn(this.turnDirection);
  }
}

module.exports = Ship;