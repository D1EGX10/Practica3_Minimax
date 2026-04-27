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