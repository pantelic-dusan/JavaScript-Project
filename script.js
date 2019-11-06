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

Piece.prototype.movePiece = function() {
    this.position.row++;
    for(let i=0; i<this.size; i++) {
        let row = this.position.row-1;
        let column = this.position.column + i;
        console.log(row);
        if(row >= 0 && row < this.gameBoard.numOfRows && column >= 0 && column < this.gameBoard.numOfColumns) {
            let block = document.getElementById('block-' + row + '-' + column);
            block.style.color = this.gameBoard.color;
        }
    }
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
}

GameBoard.prototype = Object.create(Board.prototype);

GameBoard.prototype.update = function() {
    if(this.activePiece == null) {
        this.activePiece = new OPiece(this);
        this.activePiece.createPiece();
    }
    for(let i=0; i<this.activePiece.size; i++) {
        for(let j=0; j<this.activePiece.size; j++) {
            if(this.activePiece.pieceMatrix[i][j] == 1) {
                let row = this.activePiece.position.row + i;
                if(row >= this.numOfRows) {
                    this.activePiece.createPiece();
                    break;
                } 
                let column = this.activePiece.position.column + j;
                if(row >= 0 && row < this.numOfRows && column >= 0 && column < this.numOfColumns) {
                    let block = document.getElementById('block-' + row + '-' + column);
                    block.style.color = this.activePiece.color;
                }
            }
        }
    }
    this.activePiece.movePiece();
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


function gameEnd() {
    return false;
}

function gameLoop(gameBoard, pieceBoard) {
    if(!gameEnd()){
        gameBoard.update();
        //pieceBoard.update();
        sleep(1000).then(() => {
            gameLoop(gameBoard, pieceBoard);
        });
    }
}


function main() {
    var gameBoardContainerElement = document.getElementById('game-board-container');
    var gameBoardElement = document.getElementById('game-board');
    var gameBoard = new GameBoard(gameBoardContainerElement, gameBoardElement, 16, 10);
    gameBoard.init();

    var pieceBoardContainerElement = document.getElementById('piece-board-container');
    var pieceBoardElement = document.getElementById('piece-board');
    var pieceBoard = new PieceBoard(pieceBoardContainerElement, pieceBoardElement, 4, 4);
    pieceBoard.init();

    gameLoop(gameBoard, pieceBoard);
}

main();