// 1. cleanup code

const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

const lineSweep = () => {
  outer: for (let y = stage.length - 1; y > 0; --y) {
    for (let x = 0; x < stage[y].length; ++x) {
      if (stage[y][x] === 0) {
        continue outer;
      }
    }
    const row = stage.splice(y, 1)[0].fill(0);
    stage.unshift(row);
  }
};

const collide = (stage, player) => {
  const [m, o] = [player.tetromino, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (stage[y + o.y] && stage[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
};

const createStage = (width, height) => {
  const stage = [];

  while (height--) {
    stage.push(new Array(width).fill(0));
  }
  return stage;
};

const colors = [
  null,
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "violet",
];

const createPiece = (type) => {
  switch (type) {
    case "T":
      return [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ];
    case "L":
      return [
        [0, 2, 0],
        [0, 2, 0],
        [0, 2, 2],
      ];
    case "J":
      return [
        [0, 3, 0],
        [0, 3, 0],
        [3, 3, 0],
      ];
    case "S":
      return [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0],
      ];
    case "Z":
      return [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
      ];
    case "I":
      return [
        [0, 6, 0, 0],
        [0, 6, 0, 0],
        [0, 6, 0, 0],
        [0, 6, 0, 0],
      ];
    case "O":
      return [
        [7, 7],
        [7, 7],
      ];
  }
};

const player = {
  pos: { x: 5, y: 0 },
  tetromino: createPiece("O"),
};

const playerReset = () => {
  const tetrominos = "TISZLJO";
  const randTetromino =
    tetrominos[Math.floor(Math.random() * tetrominos.length)];
  player.tetromino = createPiece(randTetromino);
  player.pos.y = 0;
  player.pos.x =
    ((stage[0].length / 2) | 0) - ((player.tetromino[0].length / 2) | 0);
  if (collide(stage, player)) {
    stage.forEach((row) => row.fill(0));
  }
};

const stage = createStage(12, 20);

const draw = () => {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(stage, { x: 0, y: 0 });
  drawMatrix(player.tetromino, player.pos);
};

const drawMatrix = (tetromino, offset) => {
  tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = colors[value];
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

const merge = (stage, player) => {
  player.tetromino.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        stage[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
};

const playerDrop = () => {
  player.pos.y++;
  if (collide(stage, player)) {
    player.pos.y--;
    merge(stage, player);
    playerReset();
    lineSweep();
  }
  dropCounter = 0;
};

const playerMove = (direction) => {
  player.pos.x += direction;
  if (collide(stage, player)) {
    player.pos.x -= direction;
  }
};

const playerRotate = (direction) => {
  let pos = player.pos.x;
  let offset = 1;
  rotate(player.tetromino, direction);
  while (collide(stage, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.tetromino[0].length) {
      rotate(player.tetromino, -dir);
      player.pos.x = pos;
      return;
    }
  }
};

const rotate = (tetromino, direction) => {
  for (let y = 0; y < tetromino.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [tetromino[x][y], tetromino[y][x]] = [tetromino[y][x], tetromino[x][y]];
    }
  }
  if (direction > 0) {
    tetromino.forEach((row) => row.reverse());
  } else {
    tetromino.reverse();
  }
};

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
const update = (time = 0) => {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update);
};

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    playerMove(-1);
  } else if (event.key === "ArrowRight") {
    playerMove(1);
  } else if (event.key === "ArrowDown") {
    playerDrop();
  } else if (event.key === "q") {
    playerRotate(-1);
  } else if (event.key === "w") {
    playerRotate(1);
  }
});

update();
