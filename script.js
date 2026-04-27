const N = 4;
let board = Array(N).fill().map(() => Array(N).fill(""));

const boardDiv = document.getElementById("board");

function drawBoard() {
  boardDiv.innerHTML = "";

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.innerText = board[i][j];

    cell.onclick = () => {
  if (board[i][j] === "") {
    board[i][j] = "X";

    if (checkWinner("X")) {
      alert("Ganaste");
    }

    drawBoard();
  }
};

      boardDiv.appendChild(cell);
    }
  }
}

drawBoard();

function checkWinner(player) {
  // filas y columnas
  for (let i = 0; i < N; i++) {
    if (board[i].every(cell => cell === player)) return true;
    if (board.map(row => row[i]).every(cell => cell === player)) return true;
  }

  // diagonales
  if (board.map((row, i) => row[i]).every(c => c === player)) return true;
  if (board.map((row, i) => row[N - i - 1]).every(c => c === player)) return true;

  return false;
}
let nodesMinimax = 0;

function isFull() {
  return board.flat().every(c => c !== "");
}

function evaluate() {
  let score = 0;

  const lines = [];

  // filas y columnas
  for (let i = 0; i < N; i++) {
    lines.push(board[i]);
    lines.push(board.map(row => row[i]));
  }

  // diagonales
  lines.push(board.map((row, i) => row[i]));
  lines.push(board.map((row, i) => row[N - i - 1]));

  for (let line of lines) {
    let ai = line.filter(c => c === "O").length;
    let player = line.filter(c => c === "X").length;
    let empty = line.filter(c => c === "").length;

    // líneas abiertas
    if (player === 0) score += ai * ai;
    if (ai === 0) score -= player * player;

    // bloqueo de 3
    if (player === 3 && empty === 1) score -= 50;
    if (ai === 3 && empty === 1) score += 50;
  }

  // centro
  const centers = [[1,1],[1,2],[2,1],[2,2]];
  for (let [i,j] of centers) {
    if (board[i][j] === "O") score += 3;
    if (board[i][j] === "X") score -= 3;
  }

  return score;
}
function minimax(depth, isMax) {
  nodesMinimax++;

  if (checkWinner("O")) return 100;
  if (checkWinner("X")) return -100;
  if (isFull() || depth === 0) return evaluate();

  if (isMax) {
    let best = -Infinity;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (board[i][j] === "") {
          board[i][j] = "O";
          best = Math.max(best, minimax(depth - 1, false));
          board[i][j] = "";
        }
      }
    }
    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (board[i][j] === "") {
          board[i][j] = "X";
          best = Math.min(best, minimax(depth - 1, true));
          board[i][j] = "";
        }
      }
    }
    return best;
  }
}
function bestMove() {
  let bestVal = -Infinity;
  let move = null;

  nodesMinimax = 0;

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === "") {
        board[i][j] = "O";

        let val = minimax(3, false);

        board[i][j] = "";

        if (val > bestVal) {
          bestVal = val;
          move = {i, j};
        }
      }
    }
  }

  return move;
}
cell.onclick = () => {
  if (board[i][j] === "") {
    board[i][j] = "X";

    if (checkWinner("X")) {
      alert("Ganaste");
      return;
    }

    let move = bestMove();
    if (move) board[move.i][move.j] = "O";

    drawBoard();
  }
};