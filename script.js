'use strict'

var gameBoard = document.getElementById('game-board');
var gameContainer = document.getElementById('game-container');
const gameBoardSize = {
    cols: 10,
    rows: 16 
}
var blockSize = 0;

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

window.onresize = resizeGameBoard;

function calculateBlockSize() {
    var maxWidth = gameContainer.offsetWidth;
    var maxHeight = gameContainer.offsetHeight;
    blockSize = Math.floor(Math.min(maxHeight/(gameBoardSize.rows+1), maxWidth/(gameBoardSize.cols+1)));
    if(blockSize < 1) {
        blockSize = 1;
    }
    console.log(maxHeight);
}

function initGameBoard() {
    gameBoard.style.gridTemplateColumns = 'repeat(' + gameBoardSize.cols + ', 1fr)';
    gameBoard.style.gridTemplateRows = 'repeat(' + gameBoardSize.rows + ', 1fr)';
    gameBoard.style.width = blockSize*gameBoardSize.cols + 'px';
}

function drawGameBoard() {
    for(let i=0; i<gameBoardSize.cols; i++) {
        for(let j=0; j<gameBoardSize.rows; j++) {
            var node = document.createElement('i');
            node.setAttribute('id', 'block-' + i + '-' + j);
            node.setAttribute('class', 'fas fa-square');
            node.style.fontSize = blockSize.toString() + 'px';
            node.style.opacity = '0.5';
            gameBoard.appendChild(node);
        }
    }
}

function resizeGameBoard() {
    calculateBlockSize();
    initGameBoard();
    for(let i=0; i<gameBoardSize.cols; i++) {
        for(let j=0; j<gameBoardSize.rows; j++) {
            var block = document.getElementById('block-' + i + '-' + j);
            if(block != null) {
                block.style.fontSize = blockSize.toString() + 'px';
            }
        }
    }
}

function updateGameBoard() {

}

function gameEnd() {
    return false;
}

function gameLoop() {
    if(!gameEnd()){
        updateGameBoard();
        sleep(100).then(() => {
            gameLoop();
        });
    }
}

function startGame() {
    gameLoop();
}

function main() {
    calculateBlockSize();
    initGameBoard();
    drawGameBoard();
    startGame();
}

main();