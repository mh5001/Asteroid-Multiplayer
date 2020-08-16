window.onload = function () {
  const SHIP_RAD = 20;
  const shipImg = new Image();
  shipImg.src = "./texture/ship_texture.png";
  const lifeImg = new Image();
  lifeImg.src = "./texture/life.png";
  const timeImg = new Image();
  timeImg.src = "./texture/stop.png";
  const shootImg = new Image();
  shootImg.src = "./texture/wip.png";
  const turnImg = new Image();
  turnImg.src = "./texture/turn.png";

  let id;
  let shipState = 1;
  setInterval(() => {
    if (shipState === 1) shipState = 2;
    else shipState = 1;
  }, 128);
  const socket = io();
  const canvas = document.getElementById('canvas');
  const bufferCanvas = document.createElement('canvas');
  canvas.width = 1842;
  canvas.height = 977;
  bufferCanvas.width = SHIP_RAD * 2;
  bufferCanvas.height = SHIP_RAD * 2;

  ctx = canvas.getContext('2d');
  bufferCtx = bufferCanvas.getContext('2d');

  // Socket events
  socket.on("game_init", _id => {
    id = _id;
    socket.emit("game_init");
  });
  socket.on("game_update", data => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach(e => {
      if (e[0] === 'S') drawShip(e);
      if (e[0] === 'A') drawAsteroid(e);
      if (e[0] === 'B') drawBullet(e);
      if (e[0] === 'T') drawScore(e);
      if (e[0] === 'P') drawPowerup(e);
    });
  });
  
  // Handling events
  document.body.addEventListener("keydown", event => {
    if ("wasd ".includes(event.key)) {
      socket.emit("player_down_" + event.key);
    }
  });
  document.body.addEventListener("keyup", event => {
    if ("wasd ".includes(event.key)) {
      socket.emit("player_up_" + event.key);
    }
  });

  
  // Handling drawing elements
  function drawShip(data) {
    data = data.split(' ');
    const x = parseFloat(data[2]);
    const y = parseFloat(data[3]);
    const angle = parseFloat(data[4]);
    const color = data[5];
    const health = parseInt(data[6]);
    const isMoving = Math.abs(parseInt(data[7]));
    const isInvulnerable = data[8] === "true";
    
    if (data[1] === id) {
      ctx.font = "20px retro";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("you", x, y - SHIP_RAD - 5);
    }
    bufferCtx.clearRect(0, 0, SHIP_RAD * 2, SHIP_RAD * 2);
    bufferCtx.save();
    bufferCtx.fillStyle = color;
    bufferCtx.fillRect(0, 0, SHIP_RAD * 2, SHIP_RAD * 2);
    bufferCtx.globalCompositeOperation = "destination-in";
    bufferCtx.drawImage(shipImg, 0, 0, 64, 64, 0, 0, SHIP_RAD * 2, SHIP_RAD * 2);
    bufferCtx.globalCompositeOperation = "hue";
    bufferCtx.drawImage(shipImg, 64 * shipState * isMoving, 0, 64, 64, 0, 0, SHIP_RAD * 2, SHIP_RAD * 2);
    bufferCtx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(bufferCanvas, -SHIP_RAD, -SHIP_RAD + 5);
    ctx.restore();

    ctx.globalAlpha = 0.8;
    const heartX = x - (health * 15 / 2 - 3);
    for (let i = 0; i < health; i++) {
      ctx.drawImage(lifeImg, heartX + i * 15, y + SHIP_RAD + 5, 10, 10);
    }
    ctx.globalAlpha = 1;
    if (isInvulnerable) {
      ctx.beginPath();
      ctx.strokeWidth = "3px";
      ctx.arc(x, y, SHIP_RAD + 5, 0, 2 * Math.PI);
      ctx.strokeStyle = "white";
      ctx.stroke();
    }

    // For debugging
    // ctx.beginPath();
    // ctx.arc(x, y, SHIP_RAD, 0, 2 * Math.PI);
    // ctx.strokeStyle = "green";
    // ctx.stroke();
    // const veloX = Math.cos(angle) * 100;
    // const veloY = Math.sin(angle) * 100;
    // ctx.beginPath();
    // ctx.moveTo(x, y);
    // ctx.lineTo(veloX + x, veloY + y);
    // ctx.stroke();
    // End debugging
  }

  function drawAsteroid(data) {
    data = data.substring(2);
    const vertices = data.split(",");
    ctx.beginPath();
    vertices.forEach((e, i) => {
      const pos = e.split(" ");
      if (e.length) {
        if (!i) {
          ctx.moveTo(pos[0], pos[1]);
        } else {
          ctx.lineTo(pos[0], pos[1]);
        }
      }
    });
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();

    // For debugging
    // ctx.beginPath();
    // ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI);
    // ctx.strokeStyle = "#00ff00";
    // ctx.stroke();
    // End Debugging
  }

  function drawBullet(data) {
    data = data.split(' ');
    const x = parseFloat(data[1]);
    const y = parseFloat(data[2]);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.strokeWidth = "1px";
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  function drawScore(data) {
    data = data.split(' ')[1];
    ctx.fillStyle = "white";
    ctx.font = "40px retro";
    ctx.textAlign = "start";
    ctx.fillText('Score: ' + data, 10, 50);
  }

  function drawPowerup(data) {
    let img;
    if (data[1] === 'H') {
      img = lifeImg;
    } else if (data[1] === 'T') {
      img = timeImg;
    } else if (data[1] === 'S') {
      img = shootImg;
    } else if (data[1] === 'U') {
      img = turnImg;
    }

    data = data.split(' ');
    const x = parseFloat(data[1]) - 10;
    const y = parseFloat(data[2]) - 10;
    ctx.drawImage(img, x, y);
  }

  io = undefined;
}
