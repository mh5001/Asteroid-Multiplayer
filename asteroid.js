const settings = require('./settings.json');

class Asteroid {
  constructor (radius, direction, position) {
    this.vertices = [];
    this.die = false;
    const len = Math.round(Math.random() * 3) + 5;
    const angle = 2 * Math.PI / len;

    this.radius = radius;
    this.angularVel = Math.random() / 2;
    
    this.pos = {
      x: -radius,
      y: -radius
    };
    
    if (!position) {
      if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
          this.pos.x = settings.WIDTH + radius;
        }
        this.pos.y = Math.random() * settings.HEIGHT;
      } else {
        if (Math.random() > 0.5) {
          this.pos.y = settings.HEIGHT + radius;
        }
        this.pos.x = Math.random() * settings.WIDTH;
      }
    } else {
      this.pos.x = position.x;
      this.pos.y = position.y;
    }
    const dir = {};
    
    if (position){
      dir.x = direction.x;
      dir.y = direction.y;
    } else {
      dir.x = direction.x - this.pos.x + Math.round(Math.random() * 20) * randomSign();
      dir.y = direction.y - this.pos.y + Math.round(Math.random() * 20) * randomSign();
    }

    const distance = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2));
    const ratio = Math.round(Math.random() * 3 + 2) / distance;

    this.velocity = {
      x: dir.x * ratio,
      y: dir.y * ratio
    }

    let start = angle;
    for (let i = 0; i < len; i++) {
      const pos = {
        x: Math.cos(start) * radius + ((3 + Math.random() * 5) * randomSign()),
        y: Math.sin(start) * radius + ((3 + Math.random() * 5) * randomSign())
      };
      this.vertices.push(pos);
      start += angle;
    }
  }

  simplify() {
    let vertices = "";
    this.vertices.forEach(e => {
      vertices += e.x + this.pos.x;
      vertices += " ";
      vertices += e.y + this.pos.y;
      vertices += ",";
    });
    return "A|" + vertices;
  }

  update() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    if (this.pos.x <= -this.radius || this.pos.x >= settings.WIDTH + this.radius) this.die = true;
    if (this.pos.y <= -this.radius || this.pos.y >= settings.HEIGHT + this.radius) this.die = true;
  }

  isCollision(pos, rad) {
    const distance = Math.sqrt(Math.pow(this.pos.x - pos.x, 2) + Math.pow(this.pos.y - pos.y, 2));
    return distance < rad + this.radius;
  }

  split() {
    const child = [];
    const dir1 = {
      x: this.velocity.x * 1.8,
      y: this.velocity.y
    };
    child[0] = new Asteroid(this.radius / 2, dir1, this.pos);
    const dir2 = {
      x: this.velocity.x,
      y: this.velocity.y * 1.8
    };
    child[1] = new Asteroid(this.radius / 2, dir2, this.pos);

    return child;
  }
}

function randomSign() {
  return Math.round(Math.random()) * 2 - 1;
}

module.exports = Asteroid;