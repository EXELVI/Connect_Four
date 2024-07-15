
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

function init() {
    initBoard();
    renderBoard();
}

init();
