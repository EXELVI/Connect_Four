
const columns = 7;
const rows = 6;
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
    const col = event.target.getAttribute('data-col');
    dropToken(parseInt(col));
}

function dropToken(col) {
    for (let row = rows - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            renderBoard();
            checkWin(row, col);
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            return;
        }
    }
}

function checkWin(row, col) {
    if (checkVertical(row, col) || checkHorizontal(row, col) || checkDiagonal(row, col)) {
        alert(`Player ${currentPlayer} wins!`);
        initBoard();
        renderBoard();
    }
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


function init() {
    initBoard();
    renderBoard();
}

init();
