var View = require('./view');
var Board = require('./board');

$(function () {
  var canvasEl = $('.game-window');
  new View(canvasEl);
});
