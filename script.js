const columns = 7;
const rows = 6;
const maxDepth = 4; // Profondità di ricerca per l'algoritmo Minimax
let currentPlayer = 1;
let board = [];

function initBoard() {
    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let col = 0; col < columns; col++) {
            board[row][col] = 0;
        }
    }
}

function renderBoard() {
    const boardElement = document.querySelector('.board');

    boardElement.innerHTML = '';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[row][col] === 1) {
                cell.classList.add('player-1');
            } else if (board[row][col] === 2) {
                cell.classList.add('player-2');
            }
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.addEventListener('click', handleClick);
            boardElement.appendChild(cell);
        }
    }
}

function handleClick(event) {
    if (currentPlayer === 1) { // Assumiamo che il giocatore umano sia il giocatore 1
        const col = event.target.getAttribute('data-col');
        dropToken(parseInt(col));
        if (currentPlayer === 2) {
            aiMove();
        }
    }
}

function dropToken(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            renderBoard();
            if (checkWin(row, col)) {
                alert(`Player ${currentPlayer} wins!`);
                initBoard();
                renderBoard();
            }
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            return;
        }
    }
}

function checkWin(row, col) {
    return checkVertical(row, col) || checkHorizontal(row, col) || checkDiagonal(row, col);
}

function checkVertical(row, col) {
    let count = 1;
    for (let i = row + 1; i < rows; i++) {
        if (board[i][col] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    return count >= 4;
}

function checkHorizontal(row, col) {
    let count = 1;
    for (let i = col - 1; i >= 0; i--) {
        if (board[row][i] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    for (let i = col + 1; i < columns; i++) {
        if (board[row][i] === currentPlayer) {
            count++;
        } else {
            break;
        }
    }
    return count >= 4;
}

function checkDiagonal(row, col) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
        if (row - i < 0 || col - i < 0 || board[row - i][col - i] !== currentPlayer) {
            break;
        }
        count++;
    }
    for (let i = 1; i < 4; i++) {
        if (row + i >= rows || col + i >= columns || board[row + i][col + i] !== currentPlayer) {
            break;
        }
        count++;
    }
    if (count >= 4) {
        return true;
    }

    count = 1;
    for (let i = 1; i < 4; i++) {
        if (row - i < 0 || col + i >= columns || board[row - i][col + i] !== currentPlayer) {
            break;
        }
        count++;
    }
    for (let i = 1; i < 4; i++) {
        if (row + i >= rows || col - i < 0 || board[row + i][col - i] !== currentPlayer) {
            break;
        }
        count++;
    }
    return count >= 4;
}

function evaluateBoard() {
    let score = 0;

    // Valutazione orizzontale
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns - 3; col++) {
            score += evaluateSegment([board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]]);
        }
    }

    // Valutazione verticale
    for (let row = 0; row < rows - 3; row++) {
        for (let col = 0; col < columns; col++) {
            score += evaluateSegment([board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]]);
        }
    }

    // Valutazione diagonale (/)
    for (let row = 0; row < rows - 3; row++) {
        for (let col = 0; col < columns - 3; col++) {
            score += evaluateSegment([board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]]);
        }
    }

    // Valutazione diagonale (\)
    for (let row = 0; row < rows - 3; row++) {
        for (let col = 3; col < columns; col++) {
            score += evaluateSegment([board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]]);
        }
    }

    return score;
}

function evaluateSegment(segment) {
    let score = 0;
    let playerCount = 0;
    let aiCount = 0;
    let emptyCount = 0;

    for (let cell of segment) {
        if (cell === 1) {
            playerCount++;
        } else if (cell === 2) {
            aiCount++;
        } else {
            emptyCount++;
        }
    }

    if (aiCount === 4) {
        score += 100;
    } else if (aiCount === 3 && emptyCount === 1) {
        score += 10;
    } else if (aiCount === 2 && emptyCount === 2) {
        score += 5;
    }

    if (playerCount === 4) {
        score -= 100;
    } else if (playerCount === 3 && emptyCount === 1) {
        score -= 10;
    } else if (playerCount === 2 && emptyCount === 2) {
        score -= 5;
    }

    return score;
}

function minimax(board, depth, alpha, beta, maximizingPlayer) {
    const validColumns = getValidColumns();
    const isTerminal = validColumns.length === 0 || depth === 0;

    if (isTerminal) {
        if (depth === 0 || validColumns.length === 0) {
            return [null, evaluateBoard()];
        }
        if (currentPlayerWins(1)) {
            return [null, -1000];
        }
        if (currentPlayerWins(2)) {
            return [null, 1000];
        }
    }

    if (maximizingPlayer) {
        let value = -Infinity;
        let column = validColumns[Math.floor(Math.random() * validColumns.length)];
        for (let col of validColumns) {
            const row = getNextOpenRow(col);
            if (row !== null) {
                board[row][col] = 2;
                let newScore = minimax(board, depth - 1, alpha, beta, false)[1];
                board[row][col] = 0;
                if (newScore > value) {
                    value = newScore;
                    column = col;
                }
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }
        }
        return [column, value];
    } else {
        let value = Infinity;
        let column = validColumns[Math.floor(Math.random() * validColumns.length)];
        for (let col of validColumns) {
            const row = getNextOpenRow(col);
            if (row !== null) {
                board[row][col] = 1;
                let newScore = minimax(board, depth - 1, alpha, beta, true)[1];
                board[row][col] = 0;
                if (newScore < value) {
                    value = newScore;
                    column = col;
                }
                beta = Math.min(beta, value);
                if (alpha >= beta) {
                    break;
                }
            }
        }
        return [column, value];
    }
}

function getNextOpenRow(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            return row;
        }
    }
    return null;
}

function getValidColumns() {
    const validColumns = [];
    for (let col = 0; col < columns; col++) {
        if (board[0][col] === 0) {
            validColumns.push(col);
        }
    }
    return validColumns;
}

function currentPlayerWins(player) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] === player) {
                if (checkVertical(row, col) || checkHorizontal(row, col) || checkDiagonal(row, col)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function aiMove() {
    const [col, _] = minimax(board, maxDepth, -Infinity, Infinity, true);
    dropToken(col);
}

function init() {
    initBoard();
    renderBoard();
}

init();
