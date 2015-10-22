var Ractive = require('ractive');

console.log('init');
var INTERVAL = 500;

var glider = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0]
],
  intervalId, ui;

init();

function init() {
  var initialState = glider;

  ui = new Ractive({
    el: '#game-of-life',
    template: '#template',
    data: { state: initialState },
    oninit: function () {
      this.on('start', function () {
        startTicking(initialState);
      });

      this.on('toggle', function (evt, x, y) {
        var state = this.get('state');
        var cell = state[x][y];
        state[x][y] = cell === 1 ? 0 : 1;
        this.set('state', state);
      });
    }
  });
}

function startTicking(initialState) {
  var currentState = initialState;

  // writeState(initialState);
  intervalId = setInterval(function () {
    currentState = tick(currentState);
    ui.set('state', currentState);
    // writeState(currentState);
  }, INTERVAL);
}

function tick(state) {
  return state.map(function (row, x) {
    return row.map(function (cell, y) {
      var neighbours = numNeighbours(state, x, y);
      return newState(cell, neighbours);
    });
  });
}

function numNeighbours(state, x, y) {
  var num = 0;
  for (var i = x-1; i <= x+1; i++) {
    for (var j = y-1; j <= y+1; j++) {
      if (i !== x || j !== y) {
        if( state[i] !== undefined && state[i][j] !== undefined) {
          num += state[i][j];
        }
      }
    }
  }
  return num;
}

/*
- Any live cell with fewer than two live neighbours dies, as if caused by under-population.
- Any live cell with two or three live neighbours lives on to the next generation.
- Any live cell with more than three live neighbours dies, as if by over-population.
- Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
function newState(currentState, numNeighbours) {
  if (currentState === 1 ) {
    if (numNeighbours === 2 || numNeighbours === 3) {
      return 1;
    } else {
      return 0;
    }
  } else if (numNeighbours === 3) {
    return 1;
  } else {
    return 0;
  }
}


function writeState(state) {
  var html =  state.map(function (row) {
    var rowHtml = row.map(function (cell) {
      var alive = cell ? 'alive' : '';
      return '<div class="cell ' + alive + '"></div>';
    });
    return '<div class="row">' + rowHtml.join('') + '</div>';
  }).join('');

  document.getElementById('game-of-life').innerHTML = html;
}
