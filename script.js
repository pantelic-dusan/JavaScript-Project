'use strict'

window.onkeypress = function onKeyPress() {

}

function sleep(miliseconds) {
    return new Promise(resolve => setTimeout(resolve, miliseconds));
}

//  PIECE CLASS
function Piece(gameBoard) {
    this.gameBoard = gameBoard;
    this.size = 4;
    this.pieceMatrix = [[], [], [], []];
    this.position = {
        row: 0,
        column: 0
    }
}

Piece.prototype.generatePiece = function(pieceMatrix) {
    this.position.row = -4;
    this.position.column = Math.round(Math.random() * (this.gameBoard.numOfColumns - this.size));
    this.pieceMatrix = pieceMatrix;
}

Piece.prototype.movePieceDown = function() {
    var lookaheadPosition = {
        row: this.position.row+1,
        column: this.position.column
    }

    if(!this.isCoalisionDetected(lookaheadPosition)) {
        // Deletes piece on previous position
        for(let i=0; i<this.size; i++) {
            for(let j=0; j<this.size; j++) {
                if(this.pieceMatrix[i][j] == 1) {
                    let row = this.position.row + i;
                    let column = this.position.column + j;
                    if(row >= 0) {
                        let block = document.getElementById('block-' + row + '-' + column);
                        block.style.color = this.gameBoard.color;
                    }
                }
            }
        }
        this.position.row++;

        return true;
    }

    return false;
}

Piece.prototype.movePieceLeft = function() {
    var lookaheadPosition = {
        row: this.position.row,
        column: this.position.column-1
    }

    if(!this.isCoalisionDetected(lookaheadPosition)) {
        // Deletes piece on previous position
        for(let i=0; i<this.size; i++) {
            for(let j=0; j<this.size; j++) {
                if(this.pieceMatrix[i][j] == 1) {
                    let row = this.position.row + i;
                    let column = this.position.column + j;
                    if(row >= 0) {
                        let block = document.getElementById('block-' + row + '-' + column);
                        block.style.color = this.gameBoard.color;
                    }
                }
            }
        }
        this.position.column--;

        return true;
    }

    return false;
}

Piece.prototype.movePieceRight = function() {
    var lookaheadPosition = {
        row: this.position.row,
        column: this.position.column+1
    }

    if(!this.isCoalisionDetected(lookaheadPosition)) {
        // Deletes piece on previous position
        for(let i=0; i<this.size; i++) {
            for(let j=0; j<this.size; j++) {
                if(this.pieceMatrix[i][j] == 1) {
                    let row = this.position.row + i;
                    let column = this.position.column + j;
                    if(row >= 0) {
                        let block = document.getElementById('block-' + row + '-' + column);
                        block.style.color = this.gameBoard.color;
                    }
                }
            }
        }
        this.position.column++;

        return true;
    }

    return false;
}


Piece.prototype.isCoalisionDetected = function(lookaheadPosition) {
    for(let i=0; i<this.size; i++) {
        for(let j=0; j<this.size; j++) {
            if(this.pieceMatrix[i][j] == 1) {
                let row = lookaheadPosition.row + i;
                let column = lookaheadPosition.column + j;
                if(row >= this.gameBoard.numOfRows || column >= this.gameBoard.numOfColumns || column < 0) {
                    return true;
                }
                for(let index in this.gameBoard.activeBlocks) {
                    if(this.gameBoard.activeBlocks[index].row == row && this.gameBoard.activeBlocks[index].column == column) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
//  PIECE CLASS

//  OPIECE CLASS
function OPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#FFFF00';
    this.oPieceMatrix = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]];
}

OPiece.prototype = Object.create(Piece.prototype);

OPiece.prototype.createPiece = function() {
    this.generatePiece(this.oPieceMatrix);
}
//  OPIECE CLASS

//  BOARD CLASS
function Board(boardContainerElement, boardElement, numOfRows=1, numOfColumns=1) {
    this.boardContainerElement = boardContainerElement;
    this.boardElement = boardElement;
    this.numOfRows = numOfRows;
    this.numOfColumns = numOfColumns;
    this.blockSize = 1;
    this.color='#FFFFFF';
    this.opacity = 0.6;
    this.activeBlocks = [];
}

Board.prototype.init = function() {
    this.calculateBlockSize();
    this.boardElement.style.gridTemplateColumns = 'repeat(' + this.numOfColumns + ', 1fr)';
    this.boardElement.style.gridTemplateRows = 'repeat(' + this.numOfRows + ', 1fr)';
    this.boardElement.style.width = this.blockSize * this.numOfColumns + 'px';
    this.boardElement.style.height = this.blockSize * this.numOfRows + 'px';
    this.drawEmptyBoard(this.color, this.opacity);
}

Board.prototype.calculateBlockSize = function() {
    let maxWidth = this.boardContainerElement.offsetWidth;
    let maxHeight = this.boardContainerElement.offsetHeight;
    this.blockSize = Math.floor(Math.min(maxHeight/(this.numOfRows+2), maxWidth/(this.numOfColumns+2)));
    if(this.blockSize < 1) {
        this.blockSize = 1;
    }
}

Board.prototype.drawEmptyBoard = function() {
    for(let i=0; i<this.numOfColumns; i++) {
        for(let j=0; j<this.numOfRows; j++) {
            let node = document.createElement('i');
            node.setAttribute('id', 'block-' + j + '-' + i);
            node.setAttribute('class', 'fas fa-square');
            node.style.fontSize = this.blockSize.toString() + 'px';
            node.style.color = this.color;
            node.style.opacity = this.opacity.toString();
            this.boardElement.appendChild(node);
        }
    }
}
//  BOARD CLASS

//  GAMEBOARD CLASS
function GameBoard(boardContainerElement, boardElement, numOfRows=1, numOfColumns=1) {
    Board.call(this, boardContainerElement, boardElement, numOfRows, numOfColumns);
    this.activePiece = null;
    this.gameEnd = false;
}

GameBoard.prototype = Object.create(Board.prototype);

GameBoard.prototype.update = function() {
    if(this.activePiece == null) {
        this.activePiece = new OPiece(this);
        this.activePiece.createPiece();
    }

    if(this.activePiece.movePieceDown()) {
        for(let i=0; i<this.activePiece.size; i++) {
            for(let j=0; j<this.activePiece.size; j++) {
                if(this.activePiece.pieceMatrix[i][j] == 1) {
                    let row = this.activePiece.position.row + i;
                    let column = this.activePiece.position.column + j;
                    if(row >= 0) {
                        let block = document.getElementById('block-' + row + '-' + column);
                        block.style.color = this.activePiece.color;
                    }
                }
            }
        }
    } else {
        for(let i=0; i<this.activePiece.size; i++) {
            for(let j=0; j<this.activePiece.size; j++) {
                if(this.activePiece.pieceMatrix[i][j] == 1) {
                    let block = {
                        row: this.activePiece.position.row + i,
                        column: this.activePiece.position.column + j,
                        color: this.activePiece.color
                    }
                    if(block.row < 0) {
                        this.gameEnd = true;
                    } else {
                        // Add to head of array for better performance in coalision detection
                        this.activeBlocks.unshift(block);
                    }
                }
            }
        }
        for(let index in this.activeBlocks) {
            let block = document.getElementById('block-' + this.activeBlocks[index].row + '-' + this.activeBlocks[index].column);
            block.style.color = this.activeBlocks[index].color;
        }
        this.activePiece.createPiece();
    }

}

// Problem with too long key press
GameBoard.prototype.onKeyDown = function(event) {
    switch (event.key) {
        case 'ArrowLeft':
            if(this.activePiece != null) {
                this.activePiece.movePieceLeft();
            }
            break;
        case 'ArrowRight':
            if(this.activePiece != null) {
                this.activePiece.movePieceRight();
            }
            break;
        case 'ArrowDown':
            if(this.activePiece != null) {
                this.activePiece.movePieceDown();
            }
            break;
        case '':
            if(this.activePiece != null) {
                this.activePiece.movePieceRight();
            }
            break;
        default:
            break;
    }
}
//  GAMEBOARD CLASS

//  PIECEBOARD CLASS
function PieceBoard(boardContainerElement, boardElement, numOfRows=1, numOfColumns=1) {
    Board.call(this, boardContainerElement, boardElement, numOfRows, numOfColumns);
}

PieceBoard.prototype = Object.create(Board.prototype);

PieceBoard.prototype.drawEmptyBoard = function() {
    for(let i=0; i<this.numOfColumns; i++) {
        for(let j=0; j<this.numOfRows; j++) {
            let node = document.createElement('i');
            node.setAttribute('id', 'piece-block-' + j + '-' + i);
            node.setAttribute('class', 'fas fa-square');
            node.style.fontSize = this.blockSize.toString() + 'px';
            node.style.color = this.color;
            node.style.opacity = this.opacity.toString();
            this.boardElement.appendChild(node);
        }
    }
}
//  PIECEBOARDCLASS


function gameLoop(gameBoard, pieceBoard) {
    if(!gameBoard.gameEnd){
        gameBoard.update();
        //pieceBoard.update();
        sleep(100).then(() => {
            gameLoop(gameBoard, pieceBoard);
        });
    } else {
        console.log('GAME OVER');
    }
}


function main() {
    var gameBoardContainerElement = document.getElementById('game-board-container');
    var gameBoardElement = document.getElementById('game-board');
    var gameBoard = new GameBoard(gameBoardContainerElement, gameBoardElement, 16, 10);
    gameBoard.init();
    window.onkeydown = gameBoard.onKeyDown.bind(gameBoard);

    var pieceBoardContainerElement = document.getElementById('piece-board-container');
    var pieceBoardElement = document.getElementById('piece-board');
    var pieceBoard = new PieceBoard(pieceBoardContainerElement, pieceBoardElement, 4, 4);
    pieceBoard.init();

    gameLoop(gameBoard, pieceBoard);
}

main();