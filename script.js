'use strict'

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

function blockModule() {
    var row = 0;
    var column = 0;
    var color = 'white';

    function setPosition(position) {
        row = position[0];
        column = position[1];
    }
    
    function getPosition() {
        return [row, column];
    }

    function setColor(color) {
        this.color = color;
    }

    function getColor() {
        return this.color;
    }

    var publicAPI = {
        setPosition: setPosition,
        getPosition: getPosition,
        setColor: setColor,
        getColor: getColor
    }

    return publicAPI;
};

var gameBoard = (function gameBoardModule() {
    var gameContainerElement;
    var gameBoardElement;
    var blockSize;
    var numOfColumns;
    var numOfRows;
    var activeBlocks;
    
    function initGameBoard() {
        gameContainerElement = document.getElementById('game-container');
        gameBoardElement = document.getElementById('game-board');
        numOfColumns = 10;
        numOfRows = 16;
        calculateBlockSize();
        gameBoardElement.style.gridTemplateColumns = 'repeat(' + numOfColumns + ', 1fr)';
        gameBoardElement.style.gridTemplateRows = 'repeat(' + numOfRows + ', 1fr)';
        gameBoardElement.style.width = blockSize*numOfColumns + 'px';
        drawEmptyBoard();
        activeBlocks = [];
        window.onresize = resizeGameBoard();
    }

    function calculateBlockSize() {
        var maxWidth = gameContainerElement.offsetWidth;
        var maxHeight = gameContainerElement.offsetHeight;
        blockSize = Math.floor(Math.min(maxHeight/(numOfRows+1), maxWidth/(numOfColumns+1)));
        if(blockSize < 1) {
            blockSize = 1;
        }
    }

    function drawEmptyBoard() {
        for(let i=0; i<numOfColumns; i++) {
            for(let j=0; j<numOfRows; j++) {
                let node = document.createElement('i');
                node.setAttribute('id', 'block-' + i + '-' + j);
                node.setAttribute('class', 'fas fa-square');
                node.style.fontSize = blockSize.toString() + 'px';
                node.style.color = 'white';
                node.style.opacity = '0.5';
                gameBoardElement.appendChild(node);
            }
        }
    }

    function resizeGameBoard() {
        calculateBlockSize();
        gameBoardElement.style.gridTemplateColumns = 'repeat(' + numOfColumns + ', 1fr)';
        gameBoardElement.style.gridTemplateRows = 'repeat(' + numOfRows + ', 1fr)';
        gameBoardElement.style.width = blockSize*numOfColumns + 'px';
        for(let i=0; i<numOfColumns; i++) {
            for(let j=0; j<numOfRows; j++) {
                let block = document.getElementById('block-' + i + '-' + j);
                if(block != null) {
                    block.style.fontSize = blockSize.toString() + 'px';
                }
            }
        }
    }

    function updateGameBoard() {

    }

    var publicAPI = {
        init: initGameBoard,
        update: updateGameBoard
    }

    return publicAPI;
})();


function gameEnd() {
    return false;
}

function gameLoop() {
    if(!gameEnd()){
        gameBoard.update();
        sleep(100).then(() => {
            gameLoop();
        });
    }
}


function main() {
    gameBoard.init();
    gameLoop();
}

main();