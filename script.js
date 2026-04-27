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
          drawBoard();
        }
      };

      boardDiv.appendChild(cell);
    }
  }
}

drawBoard();