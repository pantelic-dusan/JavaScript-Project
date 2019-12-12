'use strict'

var isGameActive = false;
var player = document.getElementById('player');
var playerElement = document.getElementById('player-name');
var gameMenu = document.getElementById('game-menu');

window.onload = function onLoad() {
    playerElement.value = 'GUEST';
    gameMenu.style.display = 'flex';
}

window.onkeypress = function onKeyPress(event) {
    if (!this.isGameActive) {
        if (event.code == 'Space') {
            player.innerHTML = 'PLAYER : ' + playerElement.value;
            gameMenu.style.display = 'none';
            isGameActive = true;
            main();
        }
    }
}

function sleep(miliseconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, miliseconds);
    });
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
    this.originPoint = {
        row: 0,
        column: 0
    }
}

Piece.prototype.generatePiece = function(pieceMatrix, originPoint) {
    this.position.row = -4;
    this.position.column = Math.round(Math.random() * (this.gameBoard.numOfColumns - this.size));
    this.pieceMatrix = pieceMatrix;
    this.originPoint.row = originPoint.row;
    this.originPoint.column = originPoint.column;
}

Piece.prototype.movePieceDown = function() {
    var lookaheadPosition = {
        row: this.position.row+1,
        column: this.position.column
    }
    
    if(!this.isCoalisionDetected(lookaheadPosition, this.pieceMatrix)) {
        this.earsePreviousPieceDrawing();
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
    
    if(!this.isCoalisionDetected(lookaheadPosition, this.pieceMatrix)) {
        this.earsePreviousPieceDrawing();
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
    
    if(!this.isCoalisionDetected(lookaheadPosition, this.pieceMatrix)) {
        this.earsePreviousPieceDrawing();
        this.position.column++;

        return true;
    }

    return false;
}

Piece.prototype.rotatePieceClockwise = function() {
    // Rotating 4x4 matrix in place

    var lookaheadPieceMatrix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    var n = lookaheadPieceMatrix.length;
   
    for(let i=0; i<n; i++) {
        for(let j=0; j<n; j++) {
            if (this.pieceMatrix[i][j] == 1) {
                let r = Math.abs(j + this.originPoint.row - this.originPoint.column);
                let c = Math.abs(this.originPoint.column + this.originPoint.row - i);
                lookaheadPieceMatrix[r][c] = 1;
            }
        }
    }
    
    if(!this.isCoalisionDetected(this.position, lookaheadPieceMatrix)) {
        this.earsePreviousPieceDrawing();
        this.changePieceMatrix(lookaheadPieceMatrix);

        return true;
    }

    return false;
}

Piece.prototype.rotatePieceCounterClockwise = function() {
    // Rotating 4x4 matrix in place

    var lookaheadPieceMatrix = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    var n = lookaheadPieceMatrix.length;
   
    for(let i=0; i<n; i++) {
        for(let j=0; j<n; j++) {
            if (this.pieceMatrix[i][j] == 1) {
                let r = Math.abs(this.originPoint.row + this.originPoint.column - j);
                let c = Math.abs(this.originPoint.column + i - this.originPoint.row);
                lookaheadPieceMatrix[r][c] = 1;
            }
        }
    }
    
    if(!this.isCoalisionDetected(this.position, lookaheadPieceMatrix)) {
        this.earsePreviousPieceDrawing();
        this.changePieceMatrix(lookaheadPieceMatrix);

        return true;
    }

    return false;
}

Piece.prototype.isCoalisionDetected = function(lookaheadPosition, lookaheadPieceMatrix) {
    for(let i=0; i<this.size; i++) {
        for(let j=0; j<this.size; j++) {
            if(lookaheadPieceMatrix[i][j] == 1) {
                let row = lookaheadPosition.row + i;
                let column = lookaheadPosition.column + j;
                if(row >= this.gameBoard.numOfRows || column >= this.gameBoard.numOfColumns || column < 0) {
                    return true;
                }
                if(row >= 0 && this.gameBoard.blockMatrix[row][column].color != this.gameBoard.color) {
                    return true;
                }
            }
        }
    }
    return false;
}

Piece.prototype.changePieceMatrix = function(matrix) {
    for(let i=0; i<this.size; i++) {
        for(let j=0; j<this.size; j++) {
            this.pieceMatrix[i][j] = matrix[i][j];
        }
    }
}

Piece.prototype.drawPiece = function() {
    if (isGameActive) {
        for(let i=0; i<this.size; i++) {
            for(let j=0; j<this.size; j++) {
                if(this.pieceMatrix[i][j] == 1) {
                    let row = this.position.row + i;
                    let column = this.position.column + j;
                    if(row >= 0) {
                        let block = document.getElementById('block-' + row + '-' + column);
                        block.style.color = this.color;
                    }
                }
            }
        }
    }
}

Piece.prototype.earsePreviousPieceDrawing = function() {
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
}

//  PIECE CLASS

//  IPIECE CLASS
function IPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#00FFFF';
    this.iPieceMatrix = [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.iOriginPoint = {
        row: 0,
        column: 0
    }
}

IPiece.prototype = Object.create(Piece.prototype);

IPiece.prototype.createPiece = function() {
    this.generatePiece(this.iPieceMatrix, this.iOriginPoint);
}
//  IPIECE CLASS

//  OPIECE CLASS
function OPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#FFFF00';
    this.oPieceMatrix = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]];
    this.oOriginPoint = {
        row: 0,
        column: 0
    }
}

OPiece.prototype = Object.create(Piece.prototype);

OPiece.prototype.createPiece = function() {
    this.generatePiece(this.oPieceMatrix, this.oOriginPoint);
}
//  OPIECE CLASS

//  TPIECE CLASS
function TPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#800080';
    this.tPieceMatrix = [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.tOriginPoint = {
        row: 1,
        column: 1
    }
}

TPiece.prototype = Object.create(Piece.prototype);

TPiece.prototype.createPiece = function() {
    this.generatePiece(this.tPieceMatrix, this.tOriginPoint);
}
//  TPIECE CLASS

//  SPIECE CLASS
function SPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#00FF00';
    this.sPieceMatrix = [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.sOriginPoint = {
        row: 1,
        column: 1
    }
}

SPiece.prototype = Object.create(Piece.prototype);

SPiece.prototype.createPiece = function() {
    this.generatePiece(this.sPieceMatrix, this.sOriginPoint);
}
//  SPIECE CLASS

//  ZPIECE CLASS
function ZPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#FF0000';
    this.zPieceMatrix = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.zOriginPoint = {
        row: 1,
        column: 1
    }
}

ZPiece.prototype = Object.create(Piece.prototype);

ZPiece.prototype.createPiece = function() {
    this.generatePiece(this.zPieceMatrix, this.zOriginPoint);
}
//  ZPIECE CLASS

//  JPIECE CLASS
function JPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#0000FF';
    this.jPieceMatrix = [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.jOriginPoint = {
        row: 1,
        column: 1
    }
}

JPiece.prototype = Object.create(Piece.prototype);

JPiece.prototype.createPiece = function() {
    this.generatePiece(this.jPieceMatrix, this.jOriginPoint);
}
//  JPIECE CLASS

//  LPIECE CLASS
function LPiece(gameBoard) {
    Piece.call(this, gameBoard);
    this.color = '#FFA500';
    this.lPieceMatrix = [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.lOriginPoint = {
        row: 1,
        column: 1
    }
}

LPiece.prototype = Object.create(Piece.prototype);

LPiece.prototype.createPiece = function() {
    this.generatePiece(this.lPieceMatrix, this.lOriginPoint);
}
//  LPIECE CLASS

//  BOARD CLASS
function Board(boardContainerElement, boardElement, numOfRows=1, numOfColumns=1) {
    this.boardContainerElement = boardContainerElement;
    this.boardElement = boardElement;
    this.numOfRows = numOfRows;
    this.numOfColumns = numOfColumns;
    this.blockSize = 1;
    this.color='#FFFFFF';
    this.opacity = 0.6;
    this.blockMatrix = null;
}

Board.prototype.init = function() {
    this.blockMatrix = new Array(this.numOfRows);
    for(let i=0; i<this.numOfRows; i++) {
        this.blockMatrix[i] = new Array(this.numOfColumns);
    }
    this.calculateBlockSize();
    this.boardElement.style.display = 'grid'
    this.boardElement.style.gridTemplateColumns = 'repeat(' + this.numOfColumns + ', 1fr)';
    this.boardElement.style.gridTemplateRows = 'repeat(' + this.numOfRows + ', 1fr)';
    this.boardElement.style.width = this.blockSize * this.numOfColumns + 'px';
    this.boardElement.style.height = this.blockSize * this.numOfRows + 'px';
    this.drawEmptyBoard(this.color, this.opacity);
}

Board.prototype.calculateBlockSize = function() {
    let maxWidth = this.boardContainerElement.offsetWidth;
    let maxHeight = this.boardContainerElement.offsetHeight;
    this.blockSize = Math.floor(Math.min(maxHeight/(this.numOfRows+1), maxWidth/(this.numOfColumns+1)));
    if(this.blockSize < 1) {
        this.blockSize = 1;
    }
}

Board.prototype.drawEmptyBoard = function() {
    for(let i=0; i<this.numOfRows; i++) {
        for(let j=0; j<this.numOfColumns; j++) {
            let node = document.createElement('i');
            node.setAttribute('id', 'block-' + i + '-' + j);
            node.setAttribute('class', 'fas fa-square');
            node.style.fontSize = this.blockSize.toString() + 'px';
            node.style.color = this.color;
            node.style.opacity = this.opacity.toString();
            this.boardElement.appendChild(node);
            let block = {
                row: i,
                column: j,
                blockElement: node,
                color: this.color
            }
            this.blockMatrix[i][j] = block;
        }
    }
}

Board.prototype.resetBoard = function() {
    for(let i=0; i<this.numOfRows; i++) {
        for(let j=0; j<this.numOfColumns; j++) {
            let block = this.blockMatrix[i][j];
            this.boardElement.removeChild(block.blockElement);
        }
    }
}

//  BOARD CLASS

//  GAMEBOARD CLASS
function GameBoard(boardContainerElement, boardElement, numOfRows=1, numOfColumns=1) {
    Board.call(this, boardContainerElement, boardElement, numOfRows, numOfColumns);
    this.activePiece = null;
    this.nextPiece = null;
    this.holdedPiece = null;
    this.gameEnd = false;
    this.paused = false;
    this.level = 0;
    this.levelElement = document.getElementById('level');
    this.score = 0;
    this.scoreElement = document.getElementById('score');
    this.numOfDestroyedLines = 0;
}

GameBoard.prototype = Object.create(Board.prototype);

GameBoard.prototype.update = function() {
    // Creating first game piece
    if (this.activePiece == null) {
        this.activePiece = this.generateRandomPiece();
    }
    if (this.nextPiece == null) {
        this.nextPiece = this.generateRandomPiece();
    }

    if (this.activePiece.movePieceDown()) {
        this.activePiece.drawPiece();
    } else {
        for(let i=0; i<this.activePiece.size; i++) {
            for(let j=0; j<this.activePiece.size; j++) {
                if(this.activePiece.pieceMatrix[i][j] == 1) {
                    let row = this.activePiece.position.row + i;
                    let column = this.activePiece.position.column + j;
                    if(row < 0) {
                        this.gameEnd = true;
                    } else {
                        this.blockMatrix[row][column].color = this.activePiece.color;
                        this.blockMatrix[row][column].blockElement.style.color = this.activePiece.color;
                    }
                }
            }
        }
        
        this.activePiece = this.nextPiece;
        this.nextPiece = this.generateRandomPiece();
    }

    this.destroyFilledRows();

}

// Problem with too long key press
GameBoard.prototype.onKeyDown = function(event) {

    if (!isGameActive) {
        return;
    }

    if (event.code == 'Space') {
        this.paused = !this.paused;
    }

    if (!this.paused) {
        switch (event.key) {
            case 'ArrowLeft':
                if(this.activePiece != null) {
                    this.activePiece.movePieceLeft();
                    this.activePiece.drawPiece();
                }
                break;
            case 'ArrowRight':
                if(this.activePiece != null) {
                    this.activePiece.movePieceRight();
                    this.activePiece.drawPiece();
                }
                break;
            case 'ArrowDown':
                if(this.activePiece != null) {
                    this.activePiece.movePieceDown();
                    this.activePiece.drawPiece();
                }
                break;
            case 'd':
            case 'D':
                if(this.activePiece != null) {
                    this.activePiece.rotatePieceClockwise();
                    this.activePiece.drawPiece();
                }
                break;
            case 'a':
            case 'A':
                if(this.activePiece != null) {
                    this.activePiece.rotatePieceCounterClockwise();
                    this.activePiece.drawPiece();
                }
                break;
            case 'w':
            case 'W':
                if (this.holdedPiece == null && this.activePiece != null) {
                    this.holdedPiece = this.nextPiece;
                    this.nextPiece = this.generateRandomPiece();
                }
                break;
            case 's':
            case 'S':
                if (this.holdedPiece != null && this.activePiece != null) {
                    this.activePiece.earsePreviousPieceDrawing();
                    if (!this.holdedPiece.isCoalisionDetected(this.activePiece.position, this.holdedPiece.pieceMatrix)) {
                        this.holdedPiece.position = this.activePiece.position;
                        this.activePiece = this.holdedPiece;
                        this.holdedPiece = null;
                    }
                    this.activePiece.drawPiece();
                }
            default:
                break;
        }
    }
}

GameBoard.prototype.generateRandomPiece = function() {
    var piece = null;
    var pieceIndex = Math.floor(Math.random() * 7);
    switch (pieceIndex) {
        case 0:
            piece = new IPiece(this);
            piece.createPiece();
            break;
        case 1:
            piece = new OPiece(this);
            piece.createPiece();
            break;
        case 2:
            piece = new TPiece(this);
            piece.createPiece();
            break;
        case 3:
            piece = new SPiece(this);
            piece.createPiece();
            break;
        case 4:
            piece = new ZPiece(this);
            piece.createPiece();
            break;
        case 5:
            piece = new JPiece(this);
            piece.createPiece();
            break;
        case 6:
            piece = new LPiece(this);
            piece.createPiece();
            break;
        default:
            console.log('Invalid piece generated');
            break;
    }
    return piece;
}

GameBoard.prototype.destroyFilledRows = function() {
    var destroyedRowsCount = 0;
    for(let i=0; i<this.numOfRows; i++) {
        let destroyRow = true;
        for(let j=0; j<this.numOfColumns; j++) {
            if(this.blockMatrix[i][j].color == this.color){
                destroyRow = false;
            }
        }

        if(destroyRow) {
            destroyedRowsCount += 1;
            for(let k=i; k>=0; k--) {
                for(let l=0; l<this.numOfColumns; l++) {
                    let color = null;
                    if (k == 0) {
                        color = this.color;
                    } else {
                        color = this.blockMatrix[k-1][l].color;
                    }
                    this.blockMatrix[k][l].color = color;
                    this.blockMatrix[k][l].blockElement.style.color = color;
                }
            }
        }
    }

    switch (destroyedRowsCount) {
        case 1:
            this.score += 40*(this.level+1);
            this.scoreElement.innerHTML = 'SCORE : ' + this.score;
            break;
        case 2:
                this.score += 100*(this.level+1);
                this.scoreElement.innerHTML = 'SCORE : ' + this.score;
                break;
        case 3:
                this.score += 300*(this.level+1);
                this.scoreElement.innerHTML = 'SCORE : ' + this.score;
                break;
        case 4:
                this.score += 1200*(this.level+1);
                this.scoreElement.innerHTML = 'SCORE : ' + this.score;
                break;
        default:
            break;
    }

    this.numOfDestroyedLines += destroyedRowsCount;
    if (this.level >= 30) {
        if (this.numOfDestroyedLines >= 10) {
            this.numOfDestroyedLines = 0;
            this.level += 1;
            this.levelElement.innerHTML = 'LEVEL : ' + this.level;
        }
    } else if (this.numOfDestroyedLines >= (this.level*10+10) || this.numOfDestroyedLines >= Math.max(100, this.level*10-50)) {
        this.numOfDestroyedLines = 0;
        this.level += 1;
        this.levelElement.innerHTML = 'LEVEL : ' + this.level;
    }
}
//  GAMEBOARD CLASS

//  PIECEBOARD CLASS
function PieceBoard(boardContainerElement, boardElement, numOfRows=1, numOfColumns=1, pieceBoardType) {
    Board.call(this, boardContainerElement, boardElement, numOfRows, numOfColumns);
    this.pieceBoardType = pieceBoardType;
}

PieceBoard.prototype = Object.create(Board.prototype);

PieceBoard.prototype.drawEmptyBoard = function() {
    for(let i=0; i<this.numOfRows; i++) {
        for(let j=0; j<this.numOfColumns; j++) {
            let node = document.createElement('i');
            node.setAttribute('id', this.pieceBoardType + '-piece-block-' + i + '-' + j);
            node.setAttribute('class', 'fas fa-square');
            node.style.fontSize = this.blockSize.toString() + 'px';
            node.style.color = this.color;
            node.style.opacity = this.opacity.toString();
            this.boardElement.appendChild(node);
            let block = {
                row: i,
                column: j,
                blockElement: node,
                color: this.color
            }
            this.blockMatrix[i][j] = block;
        }
    }
}

PieceBoard.prototype.drawPieceOnBoard = function(piece) {
    let r = this.numOfRows;
    let c = this.numOfColumns;
    if (piece != null) {
        for(let i=0; i<r; i++) {
            for(let j=0; j<c; j++) {
                let block = document.getElementById(this.pieceBoardType + '-piece-block-' + i + '-' + j);
                if (piece.pieceMatrix[i][j] == 1) {
                    block.style.color = piece.color;
                    block.style.opacity = this.opacity;
                }
                else {
                    block.style.color = this.color;
                    block.style.opacity = 0;
                }
            }
        }
    } else {
        for(let i=0; i<r; i++) {
            for(let j=0; j<c; j++) {
                let block = document.getElementById(this.pieceBoardType + '-piece-block-' + i + '-' + j);
                block.style.color = this.color;
                block.style.opacity = 0;
            }
        }
    }
}
//  PIECEBOARDCLASS


function gameLoop(gameBoard, nextPieceBoard, holdPieceBoard) {
    if(!gameBoard.gameEnd && !gameBoard.paused){
        gameBoard.update();
        nextPieceBoard.drawPieceOnBoard(gameBoard.nextPiece);
        holdPieceBoard.drawPieceOnBoard(gameBoard.holdedPiece);

        let timeSleep = 0;
        if (gameBoard.level < 10) {
            timeSleep = (48 - (5*gameBoard.level))/60;
        } else if (gameBoard.level >= 10 && gameBoard.level <= 12) {
            timeSleep = 5/60;
        } else if (gameBoard.level >= 13 && gameBoard.level <= 15) {
            timeSleep = 4/60;
        } else if (gameBoard.level >= 16 && gameBoard.level <= 18) {
            timeSleep = 3/60;
        } else if (gameBoard.level >= 19 && gameBoard.level <= 28) {
            timeSleep = 2/60;
        } else if (gameBoard.level >= 29) {
            timeSleep = 1/60;
        }

        sleep(timeSleep*1000).then(function loop() {
            gameLoop(gameBoard, nextPieceBoard, holdPieceBoard);
        });
    } else if (!gameBoard.gameEnd) {
        sleep(1000).then(function loop() {
            gameLoop(gameBoard, nextPieceBoard, holdPieceBoard);
        });
    } else {
        sleep(500).then(function loop() {
            gameBoard.resetBoard();
            nextPieceBoard.resetBoard();
            holdPieceBoard.resetBoard();
            gameBoard.boardElement.style.display = 'none';
            gameMenu.style.display = 'flex';
            isGameActive = false;
        });
    }
}


function main() {
    document.getElementById('level').innerHTML = 'LEVEL : 0';
    document.getElementById('score').innerHTML = 'SCORE : 0';

    var gameBoardContainerElement = document.getElementById('game-board-container');
    var gameBoardElement = document.getElementById('game-board');
    var gameBoard = new GameBoard(gameBoardContainerElement, gameBoardElement, 16, 10);
    gameBoard.init();
    window.onkeydown = gameBoard.onKeyDown.bind(gameBoard);

    // Num of rows in piece board is 3 because in horizontal position piece is in first 3 rows of piece matrix

    var nextPieceBoardContainerElement = document.getElementById('next-piece-board-container');
    var nextPieceBoardElement = document.getElementById('next-piece-board');
    var nextPieceBoard = new PieceBoard(nextPieceBoardContainerElement, nextPieceBoardElement, 3, 4, "next");
    nextPieceBoard.init();

    var holdPieceBoardContainerElement = document.getElementById('hold-piece-board-container');
    var holdPieceBoardElement = document.getElementById('hold-piece-board');
    var holdPieceBoard = new PieceBoard(holdPieceBoardContainerElement, holdPieceBoardElement, 3, 4, "hold");
    holdPieceBoard.init();

    gameLoop(gameBoard, nextPieceBoard, holdPieceBoard);
}



