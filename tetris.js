const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

context.scale(20, 20);

context.fillStyle = "#000";
context.fillRect(0, 0, canvas.width, canvas.height);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const color = "red";

const drawMatrix = (matrix, color, offset) => {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = color;
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
};

drawMatrix(matrix, color);