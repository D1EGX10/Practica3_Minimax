console.log("Script iniciado");

const N = 4;
let board = Array(N).fill().map(() => Array(N).fill(""));
let gameOver = false;
let playerTurn = true;
let nodesMinimax = 0;
let nodesAlphaBeta = 0;

function drawBoard() {
  const boardDiv = document.getElementById('board');
  if (!boardDiv) return;
  
  boardDiv.innerHTML = '';
  updateTurnDisplay();
  
  for(let i = 0; i < N; i++) {
    for(let j = 0; j < N; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = board[i][j];
      
      // Colores
      if (board[i][j] === 'X') cell.style.color = '#ff6b6b';
      if (board[i][j] === 'O') cell.style.color = '#4ecdc4';
      if (board[i][j] === '') cell.style.color = '#333';
      
      cell.onclick = (function(x, y) {
        return function() {
          if (gameOver || !playerTurn) {
            console.log("Juego terminado o no es turno del jugador");
            return;
          }
          if (board[x][y] !== "") {
            console.log("Celda ocupada");
            return;
          }
          
          console.log(`Jugador mueve a ${x},${y}`);
          // Movimiento del jugador
          board[x][y] = "X";
          playerTurn = false;
          
          if (checkWinner("X")) {
            drawBoard();
            alert(" ¡Ganaste! ");
            gameOver = true;
            updateTurnDisplay();
            return;
          }
          
          if (isFull()) {
            drawBoard();
            alert(" ¡Empate! ");
            gameOver = true;
            updateTurnDisplay();
            return;
          }
          
          drawBoard();
          
          // Turno de la IA después de un breve retraso
          setTimeout(() => {
            if (!gameOver && !playerTurn) {
              console.log("Turno de la IA");
              nodesMinimax = 0;
              nodesAlphaBeta = 0;
              
              let move = bestMoveAlphaBeta();
              console.log("IA mueve a:", move);
              
              if (move) {
                board[move.i][move.j] = "O";
                
                if (checkWinner("O")) {
                  drawBoard();
                  alert(" ¡Gana la IA! ");
                  gameOver = true;
                  updateTurnDisplay();
                  return;
                }
                
                if (isFull()) {
                  drawBoard();
                  alert(" ¡Empate! ");
                  gameOver = true;
                  updateTurnDisplay();
                  return;
                }
                
                playerTurn = true;
                drawBoard();
                
                document.getElementById("minimaxCount").innerText = nodesMinimax;
                document.getElementById("alphaCount").innerText = nodesAlphaBeta;
              }
            }
          }, 200);
        };
      })(i, j);
      
      boardDiv.appendChild(cell);
    }
  }
}

function updateTurnDisplay() {
  const turnSpan = document.getElementById("turn");
  if (!turnSpan) return;
  
  if (gameOver) {
    turnSpan.innerText = "Juego Terminado";
    turnSpan.style.color = "#ff6b6b";
  } else {
    turnSpan.innerText = playerTurn ? "Jugador (X)" : "IA (O)";
    turnSpan.style.color = playerTurn ? "#ff6b6b" : "#4ecdc4";
  }
}

function isFull() {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === "") return false;
    }
  }
  return true;
}

function checkWinner(player) {
  // Verificar filas
  for (let i = 0; i < N; i++) {
    let win = true;
    for (let j = 0; j < N; j++) {
      if (board[i][j] !== player) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }
  
  // Verificar columnas
  for (let j = 0; j < N; j++) {
    let win = true;
    for (let i = 0; i < N; i++) {
      if (board[i][j] !== player) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }
  
  // Diagonal principal
  let win = true;
  for (let i = 0; i < N; i++) {
    if (board[i][i] !== player) {
      win = false;
      break;
    }
  }
  if (win) return true;
  
  // Diagonal secundaria
  win = true;
  for (let i = 0; i < N; i++) {
    if (board[i][N - i - 1] !== player) {
      win = false;
      break;
    }
  }
  if (win) return true;
  
  return false;
}

function evaluate() {
  // Prioridad máxima para victorias/derrotas
  if (checkWinner("O")) return 100000;
  if (checkWinner("X")) return -100000;
  
  let score = 0;
  
  // Evaluar todas las líneas (filas, columnas, diagonales)
  const lines = [];
  
  // Filas
  for (let i = 0; i < N; i++) {
    lines.push(board[i]);
  }
  
  // Columnas
  for (let j = 0; j < N; j++) {
    const col = [];
    for (let i = 0; i < N; i++) {
      col.push(board[i][j]);
    }
    lines.push(col);
  }
  
  // Diagonal principal
  const diag1 = [];
  for (let i = 0; i < N; i++) {
    diag1.push(board[i][i]);
  }
  lines.push(diag1);
  
  // Diagonal secundaria
  const diag2 = [];
  for (let i = 0; i < N; i++) {
    diag2.push(board[i][N - i - 1]);
  }
  lines.push(diag2);
  
  // Evaluar cada línea
  for (const line of lines) {
    let aiCount = 0;
    let playerCount = 0;
    let emptyCount = 0;
    
    for (const cell of line) {
      if (cell === "O") aiCount++;
      else if (cell === "X") playerCount++;
      else emptyCount++;
    }
    
    // Solo líneas sin oponente (abiertas)
    if (aiCount > 0 && playerCount === 0) {
      // Fichas propias en líneas abiertas
      score += Math.pow(aiCount, 3);
      
      // Línea casi completa (a punto de ganar)
      if (aiCount === 3 && emptyCount === 1) {
        score += 5000;
      }
    }
    
    if (playerCount > 0 && aiCount === 0) {
      // Bloquear líneas del oponente
      score -= Math.pow(playerCount, 3);
      
      // Prioridad máxima para bloquear victoria del oponente
      if (playerCount === 3 && emptyCount === 1) {
        score -= 10000;
      }
    }
  }
  
  // Control del centro
  const centers = [[1,1], [1,2], [2,1], [2,2]];
  for (const [i,j] of centers) {
    if (board[i][j] === "O") score += 10;
    if (board[i][j] === "X") score -= 10;
  }
  
  return score;
}

function minimax(depth, isMax) {
  nodesMinimax++;
  
  const evalScore = evaluate();
  
  if (depth === 0 || Math.abs(evalScore) >= 100000 || isFull()) {
    return evalScore;
  }
  
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

function alphabeta(depth, alpha, beta, isMax) {
  nodesAlphaBeta++;
  
  const evalScore = evaluate();
  
  if (depth === 0 || Math.abs(evalScore) >= 100000 || isFull()) {
    return evalScore;
  }
  
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (board[i][j] === "") {
          board[i][j] = "O";
          best = Math.max(best, alphabeta(depth - 1, alpha, beta, false));
          board[i][j] = "";
          alpha = Math.max(alpha, best);
          if (beta <= alpha) break;
        }
      }
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (board[i][j] === "") {
          board[i][j] = "X";
          best = Math.min(best, alphabeta(depth - 1, alpha, beta, true));
          board[i][j] = "";
          beta = Math.min(beta, best);
          if (beta <= alpha) break;
        }
      }
      if (beta <= alpha) break;
    }
    return best;
  }
}

function bestMoveAlphaBeta() {
  let bestVal = -Infinity;
  let move = null;
  const depth = 3;
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === "") {
        board[i][j] = "O";
        const valAB = alphabeta(depth, -Infinity, Infinity, false);
        board[i][j] = "";
        
        if (valAB > bestVal) {
          bestVal = valAB;
          move = {i, j};
        }
      }
    }
  }
  
  return move;
}

function resetGame() {
  console.log("Reset del juego");
  board = Array(N).fill().map(() => Array(N).fill(""));
  gameOver = false;
  playerTurn = true;
  nodesMinimax = 0;
  nodesAlphaBeta = 0;
  
  const minimaxCount = document.getElementById("minimaxCount");
  const alphaCount = document.getElementById("alphaCount");
  if (minimaxCount) minimaxCount.innerText = "0";
  if (alphaCount) alphaCount.innerText = "0";
  
  drawBoard();
}

// Inicializar el juego
drawBoard();
window.resetGame = resetGame;