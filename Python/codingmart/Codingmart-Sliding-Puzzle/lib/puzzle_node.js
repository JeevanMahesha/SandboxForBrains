var Board = require("./board");

function PuzzleNode(board) {
  this.board = board;
  this.move = {};
  this.parent = null;
  this.children = [];
  this.distance = 0;
  this.priority = 0;
}

PuzzleNode.prototype.setParent = function (parent) {
  this.parent = parent;
  if (this.parent) this.parent.children.push(this);
};

PuzzleNode.prototype.addChild = function (child) {
  child.setParent(this);
};

PuzzleNode.prototype.moveString = function () {
  return Board.moveInfoString(this.move);
};

module.exports = PuzzleNode;
