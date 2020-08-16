const express = require('express');
const path = require('path');
const socketHandler = require('./socket_handle.js');
const app = express();

const Asteroid = require('./asteroid.js');
const Bullet = require('./bullet.js');
const Powerup = require('./powerup.js');

const settings = require('./settings.json');

const ShipList = {};
const AsteroidList = [];
const BulletList = [];
const Powerups = [];

let totalScore = 0;
let isTimeStop = {
  value: false
};

const server = app.listen(1000, function () {
  console.log('Server is ready');
});
const io = require('socket.io')(server);

app.use(express.static('./public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const gameTick = setInterval(() => {
  let data = [];
  // Ship Handling
  const sKeys = Object.keys(ShipList);
  if (!sKeys.length) {
    if (AsteroidList.length) AsteroidList.length = 0;
    if (BulletList.length) BulletList.length = 0;
    if (totalScore) totalScore = 0;
    return;
  }
  sKeys.forEach(key => {
    data.push(ShipList[key].simplify());

    ShipList[key].update();

    if (ShipList[key].shootCooldown > 0) ShipList[key].shootCooldown--;
    else {
      if (ShipList[key].isShooting) {
        BulletList.push(new Bullet(ShipList[key].pos, ShipList[key].angle));
        ShipList[key].shootCooldown = ShipList[key].cooldownTime;
      }
    }
  });
  BulletList.forEach((bullet, i) => {
    data.push(bullet.simplify());

    bullet.update();
    if (bullet.die) {
      BulletList.splice(i, 1);
    }
  });
  Powerups.forEach((powerup, i) => {
    sKeys.forEach(key => {
      const isCollision = powerup.isCollision(ShipList[key].pos, settings.SHIP_RAD);
      if (isCollision) {
        powerup.die = true;
        if (powerup.id === 'T') powerup.effect(isTimeStop);
        else powerup.effect(ShipList[key]);
      }
    });

    if (powerup.die) Powerups.splice(i, 1);
    data.push(powerup.simplify());
  });

  AsteroidList.forEach((e, i) => {
    if (!isTimeStop.value) e.update();

    sKeys.forEach(key => {
      if (!ShipList[key]) return;
      const isCollision = e.isCollision(ShipList[key].pos, settings.SHIP_RAD);
      if (isCollision) {
        if (!ShipList[key].invulnerable) ShipList[key].health--;
        e.die = true;

        if (ShipList[key].health <= 0) {
          delete ShipList[key];
        }
      }
    });
    BulletList.forEach(bullet => {
      const isCollision = e.isCollision(bullet.pos, settings.BULLET_RAD);
      if (isCollision) {
        bullet.die = true;
        e.die = true;
        if (e.radius > 16) {
          const childs = e.split();
          AsteroidList.push(childs[0]);
          AsteroidList.push(childs[1]);
        }

        totalScore += 1200 / e.radius;

        if (Math.random() < 0.3) {
          if (Math.random() < 0.1 && Math.random() < 0.5) {
            Powerups.push(new Powerup.TimePowerup(e.pos));
            return;
          }
          if (Math.random() < 0.5 && Math.random() < 0.5) {
            if (Math.random() < 0.5) Powerups.push(new Powerup.ShootPowerup(e.pos));
            else Powerups.push(new Powerup.TurnPowerup(e.pos));
            return;
          }
          if (Math.random() < 0.6) Powerups.push(new Powerup.LifePowerup(e.pos));
        }
      }
    });

    data.push(e.simplify());

    if (e.die) {
      AsteroidList.splice(i, 1);
    }
  });

  if (AsteroidList.length < settings.MAX_ASTEROID) {
    if (Math.random() < 0.1) {
      const randShip = ShipList[sKeys[Math.floor(Math.random() * sKeys.length)]];
      if (randShip) AsteroidList.push(new Asteroid(60, randShip.pos));
    }
  }

  data.push('T ' + totalScore);
  io.sockets.emit("game_update", data);
}, 16);

socketHandler(io, ShipList);
