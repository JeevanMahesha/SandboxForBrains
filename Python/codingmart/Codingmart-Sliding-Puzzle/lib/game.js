var Board = require('./board');
var Solver = require('./solver');

function Game (gridSize) {
  this.gridSize = gridSize || 3;
  this.board = new Board(this.gridSize);
  this.initialBoard = this.board.duplicate();
}

Game.prototype.playMove = function (pos) {
  this.board.move(pos);
};

Game.prototype.isOver = function () {
  return this.board.isOver();
};

Game.prototype.getSolution = function () {
  if (!this.solution) {
    this.solution = new Solver(this.initialBoard).solution;
  }
  return this.solution;
};

module.exports = Game;
