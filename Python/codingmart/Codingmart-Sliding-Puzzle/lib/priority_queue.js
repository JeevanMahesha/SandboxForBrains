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
