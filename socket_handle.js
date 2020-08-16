const Ship = require('./ship.js');

function handleSocketEvents(io, ShipList) {
  io.on('connection', function (socket) {
    socket.emit("game_init", socket.id);
    socket.on("game_init", () => {
      ShipList[socket.id] = new Ship(socket.id);
    });
    // Ship start move
    socket.on("player_down_w", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].move(1);
    });
    socket.on("player_down_s", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].move(-0.5);
    });
    socket.on("player_down_a", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].turn(-1);
    });
    socket.on("player_down_d", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].turn(1);
    });
    socket.on("player_down_ ", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].isShooting = true;
    });
    // Ship stop move
    socket.on("player_up_w", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].direction = 0;
    });
    socket.on("player_up_s", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].direction = 0;
    });
    socket.on("player_up_a", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].turnDirection = 0;
    });
    socket.on("player_up_d", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].turnDirection = 0;
    });
    socket.on("player_up_ ", function () {
      if (!ShipList[socket.id]) return;
      ShipList[socket.id].isShooting = false;
    });
    // User leave
    socket.on("disconnect", function () {
      delete ShipList[socket.id];
    });
  });
}

module.exports = handleSocketEvents;