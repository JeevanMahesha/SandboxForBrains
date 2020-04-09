/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Board = __webpack_require__(3);
	
	$(function () {
	  var canvasEl = $('.game-window');
	  new View(canvasEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(2);
	var _solutionNodes;
	var _playing;
	
	var View = function () {
	  this.$gridPuzzle = $('#grid-puzzle');
	  this.$gridSolution = $('#grid-solution');
	  this.$time = $(".time");
	  this.$moves = $(".moves");
	  this.$modal = $("#solution-modal");
	  this.$puzzleSolution = $("#puzzle-solution");
	  this.setupWindow();
	};
	
	View.prototype.setupWindow = function () {
	  $('#level').on('input change', function (event) {
	    var gridSize = event.currentTarget.value;
	    $('#rangeText').text('Grid Size: ' + gridSize + ' x ' + gridSize);
	   });
	
	  $("#new-game").click(function (event) {
	    event.preventDefault();
	    this.newGame(parseInt($('#level').val()));
	  }.bind(this));
	
	  $("#solver").click(function (event) {
	    this.$modal.css('display', 'flex');
	    this.solvePuzzle();
	  }.bind(this));
	
	  $("#solution-modal-close").click(function (event) {
	    this.handleCloseModal();
	  }.bind(this));
	
	  $(window).click(function(event) {
	    if (this.$modal.is(event.target)) {
	      this.handleCloseModal();
	    } else if ($.contains(this.$modal[0], event.target) && this.$solverSteps) {
	      this.$solverSteps.focus();
	    }
	  }.bind(this));
	};
	
	View.prototype.handleCloseModal = function () {
	  this.$modal.hide();
	  if (this.$gridSolver) this.handleStopPlay();
	};
	
	View.prototype.newGame = function (gridSize) {
	  this.$gridPuzzle.removeClass('game-over');
	  this.$gridPuzzle.html('');
	  this.$gridSolution.html('');
	  clearInterval(this.timeDisplay);
	  this.$gridPuzzle.off("click");
	  this.game = new Game(gridSize);
	  this.bindEvents();
	  this.time = new Date();
	  this.setupBoard(this.$gridPuzzle, this.game.board.grid);
	  this.setupBoard(this.$gridSolution, this.game.board.solution);
	  this.$time.html(0);
	  this.$moves.html(0);
	  this.timer();
	};
	
	View.prototype.bindEvents = function () {
	  this.$gridPuzzle.on('click', 'li', (function (event) {
	    var $tile = $(event.currentTarget);
	    this.gameMove($tile);
	  }).bind(this));
	};
	
	View.prototype.gameMove = function ($tile) {
	  var pos = $tile.data("pos");
	
	  try {
	    this.game.playMove(pos);
	  } catch (e) {
	    // alert("Invalid move! Try again.");
	    return;
	  }
	
	  View.domMove($tile, this.$gridPuzzle);
	  this.$moves.html(parseInt(this.$moves.html()) + 1);
	
	  if (this.game.isOver()) {
	    this.$gridPuzzle.addClass('game-over');
	    clearInterval(this.timeDisplay);
	    this.$gridPuzzle.off("click");
	  }
	};
	
	View.domMove = function($tile, $board) {
	  var value = $tile.attr("value");
	  var $oldEmpty = $board.find(".empty");
	  $tile.removeAttr("value");
	  $tile.addClass('empty');
	  $oldEmpty.attr("value", value);
	  $oldEmpty.removeClass('empty');
	};
	
	View.prototype.setupBoard = function ($board, gridArray) {
	  $board.html('');
	  for (var rowIdx = 0; rowIdx < this.game.gridSize; rowIdx++) {
	    var $ul = $('<ul>');
	
	    for (var colIdx = 0; colIdx < this.game.gridSize; colIdx++) {
	      var num = gridArray[rowIdx * this.game.gridSize + colIdx];
	      var $li;
	      if (num === null) {
	        $li = $('<li></li>');
	        if ($board !== this.$gridSolution) $li.addClass('empty');
	      } else {
	        $li = $('<li value=' + num + '></li>');
	      }
	      $li.data('pos', rowIdx * this.game.gridSize + colIdx);
	      $ul.append($li);
	    }
	
	    $board.append($ul);
	  }
	};
	
	View.prototype.timer = function () {
	  this.timeDisplay = setInterval(function () {
	    this.$time.html(Math.floor((new Date() - this.time) / 1000));
	  }.bind(this), 1000);
	};
	
	View.prototype.solvePuzzle = function () {
	  if (this.game) {
	    this.$puzzleSolution.html('');
	    _solutionNodes = this.game.getSolution();
	
	    if (_solutionNodes.length > 0) {
	      this.setupSolver();
	      this.$solverSteps.attr("max", _solutionNodes.length - 1);
	      this.$solverSteps.focus();
	      var stepWord = (_solutionNodes.length - 1) === 1 ? 'step' : 'steps';
	      this.$solverCount.html(`${_solutionNodes.length - 1} ${stepWord}`);
	      this.setupSolverDetail();
	      this.handleStepInput(0);
	    } else {
	      this.$puzzleSolution.html('<h2>Solution not available. Try smaller grid.</h2>');
	    }
	  }
	};
	
	View.prototype.setupSolver = function () {
	  this.$gridSolver = $('<div id="grid-solver">');
	  this.$solverSteps = $('<input id="solver-steps" type="range" min="0" value="0" step="1">');
	  this.$solverPlay = $('<input id="solver-play" class="button" type="button" value="Play">');
	  this.$solverCount = $('<h3>');
	  this.$solverText = $('<div id="solver-text">');
	  this.$puzzleSolution
	    .append(this.$gridSolver)
	    .append(this.$solverCount)
	    .append(
	      $('<div id="solver-detail"><h2>Solution:</h2></div>')
	        .append(this.$solverCount)
	        .append(this.$solverText)
	    )
	    .append(
	      $('<div id="play-div">')
	        .append(this.$solverSteps)
	        .append(this.$solverPlay)
	    );
	
	  this.$solverSteps.on('input', function (event) {
	    var step = parseInt(event.currentTarget.value);
	    this.setupBoard(this.$gridSolver, _solutionNodes[step].board.grid);
	    this.handleStepList(step);
	    this.$solverSteps.trigger('change');
	   }.bind(this));
	
	  this.$solverSteps.on('change', function (event) {
	    if (_playing) {
	      this.$solverPlay.val('Pause');
	    } else if (parseInt(this.$solverSteps.val()) === parseInt(this.$solverSteps.attr("max"))) {
	      this.$solverPlay.val('Replay');
	    } else {
	      this.$solverPlay.val('Play');
	    }
	  }.bind(this));
	
	  this.$solverPlay.click(function (event) {
	    if (_playing) {
	      this.handleStopPlay();
	    } else {
	      if (parseInt(this.$solverSteps.val()) === parseInt(this.$solverSteps.attr("max"))) {
	        this.handleStepInput(0);
	      }
	      _playing = setInterval(function () {
	        this.handleStepInput(parseInt(this.$solverSteps.val()) + 1);
	        if (parseInt(this.$solverSteps.val()) === parseInt(this.$solverSteps.attr("max"))) {
	          this.handleStopPlay();
	        }
	      }.bind(this), 450);
	      this.$solverSteps.trigger('change');
	    }
	  }.bind(this));
	
	  this.$solverText.on('click', 'li', function (event) {
	    var $li = $(event.target).closest('li');
	    this.$solverSteps.val($li.data('step'));
	    this.$solverSteps.trigger('input');
	  }.bind(this));
	};
	
	View.prototype.handleStopPlay = function () {
	  clearInterval(_playing);
	  _playing = false;
	  this.$solverSteps.trigger('change');
	};
	
	View.prototype.setupSolverDetail = function () {
	  this.$solverText.html('');
	  var $ul = $('<ul>');
	
	  _solutionNodes.forEach(function(node, index) {
	    $ul.append(
	      $('<li>')
	        .data('step', index)
	        .html(node.moveString())
	        .prepend(
	          $('<span>')
	            .html(index+'.')
	          )
	    );
	  });
	
	  this.$solverText.append($ul);
	};
	
	View.prototype.handleStepInput = function (currentStep) {
	  this.$solverSteps.val(currentStep);
	  this.$solverSteps.trigger('input');
	};
	
	View.prototype.handleStepList = function (currentStep) {
	  var viewInstance = this;
	  $('li', this.$solverText).each(function() {
	    if ($(this).data('step') === currentStep) {
	      $(this).addClass('current');
	      handleListView($(this), viewInstance.$solverText, 50);
	    } else {
	      $(this).removeClass('current');
	    }
	  });
	};
	
	function handleListView($item, $list, scrollBuffer) {
	  var listTop = $list.offset().top;
	  var listBottom = listTop + $list.innerHeight();
	  var distFromTop = $item.offset().top - listTop;
	  var distFromBottom = $item.offset().top - listBottom;
	  var scrollState = $list.scrollTop();
	  var scrollDist = $list.innerHeight() - scrollBuffer;
	
	  if (distFromTop < scrollBuffer) {
	    scrollState -= scrollDist;
	  } else if (distFromBottom > -scrollBuffer) {
	    scrollState += scrollDist;
	  } else {
	    return;
	  }
	
	  $list.animate({scrollTop: scrollState}, 400);
	}
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var Solver = __webpack_require__(5);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);
	
	function Board (gridSize) {
	  if (gridSize) {
	    this.gridSize = gridSize;
	    this.solution = Board.tileContent(this.gridSize);
	    while (!this.grid || this.isOver()) {
	      this.grid = Board.makeSolvable(this.solution);
	    }
	    this.emptyPosition = this.grid.indexOf(null);
	  }
	}
	
	Board.prototype.duplicate = function () {
	  var newBoard = new Board();
	  newBoard.gridSize = this.gridSize;
	  newBoard.solution = this.solution;
	  newBoard.grid = this.grid.slice(0);
	  newBoard.emptyPosition = this.emptyPosition;
	  return newBoard;
	};
	
	function shuffleArray(array) {
	  var shuffled = array.slice(0);
	  for (var i = array.length - 1; i > 0; i--) {
	      var j = Math.floor(Math.random() * (i + 1));
	      var temp = shuffled[i];
	      shuffled[i] = shuffled[j];
	      shuffled[j] = temp;
	  }
	  return shuffled;
	}
	
	Board.makeSolvable = function (array) {
	  var tileArray = shuffleArray(array);
	  if (Board.isSolvable(tileArray)) {
	    return tileArray;
	  } else {
	    return Board.makeSolvable(tileArray);
	  }
	};
	
	Board.tileContent = function (gridSize) {
	  var tileRange = [];
	  for (var i = 1; i < Math.pow(gridSize, 2); i++) {
	    tileRange.push(i);
	  }
	  tileRange.push(null);
	  return tileRange;
	};
	
	Board.isSolvable = function (tileArray) {
	  var parity = 0;
	  var row = 0;
	  var gridSize = Math.sqrt(tileArray.length);
	  var blankRow = 0;
	
	  for (var i = 0; i < tileArray.length; i++) {
	    if (i % gridSize === 0) {
	      row++;
	    }
	
	    if (tileArray[i] === null) {
	      blankRow = row;
	    }
	
	    for (var j = i + 1; j < tileArray.length; j++) {
	      if (tileArray[i] > tileArray[j] && tileArray[j] !== null) {
	        parity++;
	      }
	    }
	  }
	
	  if (gridSize % 2 === 0 && blankRow % 2 !== 0) {
	    return parity % 2 !== 0;
	  } else {
	    return parity % 2 === 0;
	  }
	};
	
	Board.prototype.isOver = function () {
	  return this.solution.toString() === this.grid.toString();
	};
	
	Board.prototype.surroundingPositions = function (origPos) {
	  var positions = [];
	  var origCoords = Board.coords(origPos, this.gridSize);
	  positions.push(origPos + 1);
	  positions.push(origPos - 1);
	  positions.push(origPos + this.gridSize);
	  positions.push(origPos - this.gridSize);
	  return  positions.filter(function (pos) {
	    var posCoords = Board.coords(pos, this.gridSize);
	    var horizDist = Math.abs(posCoords[1] - origCoords[1]);
	    var vertDist = Math.abs(posCoords[0] - origCoords[0]);
	    return this.isValidPos(pos) && horizDist + vertDist == 1;
	  }.bind(this));
	};
	
	Board.coords = function(pos, gridSize) {
	  var row = Math.floor(pos / gridSize);
	  var col = pos % gridSize;
	  return [row, col];
	};
	
	Board.prototype.isValidPos = function (pos) {
	  return 0 <= pos && pos < Math.pow(this.gridSize, 2);
	};
	
	Board.prototype.validMoves = function () {
	  return this.surroundingPositions(this.emptyPosition);
	};
	
	Board.prototype.isValidMove = function (pos) {
	  return this.validMoves().includes(pos);
	};
	
	Board.prototype.move = function (pos) {
	  if (!this.isValidMove(pos)) {
	    throw new MoveError("Is not valid position");
	  }
	  var currentEmpty = this.emptyPosition;
	  this.grid[currentEmpty] = this.grid[pos];
	  this.emptyPosition = pos;
	  this.grid[pos] = null;
	  return Board.moveInfo(currentEmpty, pos, this);
	};
	
	Board.determineDirection = function (currentEmpty, nextEmpty, gridSize) {
	  var from = Board.coords(currentEmpty, gridSize);
	  var to = Board.coords(nextEmpty, gridSize);
	  var direction;
	  if (from[0] - to[0] === 1) {
	    direction = "down";
	  } else if (from[0] - to[0] === -1) {
	    direction = "up";
	  } else if (from[1] - to[1] === 1) {
	    direction = "right";
	  } else if (from[1] - to[1] === -1) {
	    direction = "left";
	  }
	  return direction;
	};
	
	Board.moveInfo = function (to, from, board) {
	  // used on the board after the move
	  return {
	    "value" : board.grid[to],
	    "from" : from,
	    "to" : to,
	    "direction" : Board.determineDirection(to , from, board.gridSize)
	  };
	};
	
	Board.moveInfoString = function(moveInfo) {
	  if (!jQuery.isEmptyObject(moveInfo)) {
	    return `${moveInfo.value} ${moveInfo.direction} from ${moveInfo.from} to ${moveInfo.to}`;
	  } else {
	    return "Initial Board";
	  }
	};
	
	module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}
	
	module.exports = MoveError;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var PuzzleNode = __webpack_require__(6);
	var PriorityQueue = __webpack_require__(7);
	
	function Solver(board) {
	  var solverBoard = board.duplicate();
	  this.solution = findSolution(solverBoard);
	}
	
	function possibleBoards(board) {
	  return board.validMoves().map(function(pos) {
	    var newBoard = board.duplicate();
	    newBoard.move(pos);
	    return newBoard;
	  });
	}
	
	function manhattanDistace(board) {
	  return board.grid.reduce(function(distance, currentTile, index) {
	    var adder = 0;
	    if (currentTile) {
	      var correctPos = currentTile - 1;
	      var colDist = Math.abs(index % board.gridSize - correctPos % board.gridSize);
	      var rowDist = Math.abs(Math.floor(index / board.gridSize) - Math.floor(correctPos / board.gridSize));
	      adder = colDist + rowDist;
	    }
	    return distance + adder;
	  }, 0);
	}
	
	function findSolution(board) {
	  if (board.gridSize > 3) return [];
	  var visited = {};
	  visited[board.grid] = true;
	  var rootNode = new PuzzleNode(board);
	  rootNode.priority = manhattanDistace(rootNode.board);
	  var boardQueue = new PriorityQueue([rootNode]);
	  var currentNode = boardQueue.pop();
	  var solved;
	  while (currentNode) {
	    var currentBoard = currentNode.board;
	    if (currentBoard.isOver()) {
	      solved = currentNode;
	      break;
	    }
	    var nextBoards = filterVisited(possibleBoards(currentBoard), visited);
	    boardQueue.add(nextBoards.map(function (board) {
	      var nextNode = new PuzzleNode(board);
	      nextNode.distance = currentNode.distance + 1;
	      nextNode.priority = nextNode.distance + manhattanDistace(nextNode.board);
	      nextNode.move = Board.moveInfo(currentBoard.emptyPosition, board.emptyPosition, board);
	      nextNode.setParent(currentNode);
	      return nextNode;
	    }));
	    currentNode = boardQueue.pop();
	  }
	  return solved ? traceBack(solved) : [];
	}
	
	function filterVisited(boards, visited) {
	  return boards.filter(function(board) {
	    var isVisited = !visited[board.grid];
	    visited[board.grid] = true;
	    return isVisited;
	  });
	}
	
	function traceBack(endNode) {
	  var nodes = [];
	  var currentNode = endNode;
	  while (currentNode) {
	    nodes.unshift(currentNode);
	    currentNode = currentNode.parent;
	  }
	  return nodes;
	}
	
	function solutionString(solution) {
	  return solution.map(function(node) {
	    return node.moveString();
	  });
	}
	
	module.exports = Solver;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	
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


/***/ },
/* 7 */
/***/ function(module, exports) {

	function PriorityQueue(nodes) {
	  this.heap = [null];
	  this.add(nodes);
	}
	
	PriorityQueue.prototype = {
	  add: function(nodes) {
	    nodes.forEach(function(node) {
	      this.push(node);
	    }.bind(this));
	  },
	
	  push: function(node) {
	    this.bubble(this.heap.push(node) - 1);
	  },
	
	  // removes and returns the node of highest priority
	  pop: function() {
	    var topVal = this.heap[1];
	    this.heap[1] = this.heap.pop();
	    this.sink(1);
	    return topVal;
	  },
	
	  // bubbles node i up the binary tree based on
	  // priority until heap conditions are restored
	  bubble: function(i) {
	    while (i > 1) {
	      var parentIndex = i >> 1; // <=> floor(i/2)
	
	      // if equal, no bubble (maintains insertion order)
	      if (!this.isHigherPriority(i, parentIndex)) break;
	
	      this.swap(i, parentIndex);
	      i = parentIndex;
	    }
	  },
	
	  // does the opposite of the bubble() function
	  sink: function(i) {
	    while (i * 2 < this.heap.length) {
	      // if equal, left bubbles (maintains insertion order)
	      var leftHigher = true;
	      if (this.heap.length - 1 >= i * 2 + 1) {
	        leftHigher = this.isHigherPriority(i * 2, i * 2 + 1);
	      }
	      var childIndex = leftHigher ? i * 2 : i * 2 + 1;
	
	      // if equal, sink happens (maintains insertion order)
	      if (this.isHigherPriority(i, childIndex)) break;
	
	      this.swap(i, childIndex);
	      i = childIndex;
	    }
	  },
	
	  // swaps the addresses of 2 nodes
	  swap: function(i, j) {
	    var temp = this.heap[i];
	    this.heap[i] = this.heap[j];
	    this.heap[j] = temp;
	  },
	
	  // returns true if node i is higher priority than j
	  isHigherPriority: function(i, j) {
	    return this.heap[i].priority < this.heap[j].priority;
	  }
	};
	
	module.exports = PriorityQueue;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map