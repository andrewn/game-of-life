var Ractive = require('ractive');
var broadcaster = require('./broadcaster')();

require('ractive-touch');

console.log('init');
var TICK_INTERVAL_MS = 500;

var glider = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
], ui;

init();

function init() {
  var initialState = glider;

  ui = new Ractive({
    el: '#game-of-life',
    template: '#template',
    data: { state: initialState, generation: 0, isRunning: false },
    oninit: function () {
      var intervalId;

      this.on('startStop', function () {
        var isRunning = this.get('isRunning'),
            state = this.get('state');
        if (isRunning) {
          stopTicking(intervalId);
          intervalId = null;
          this.set('isRunning', false);
        } else {
          intervalId = startTicking(state);
          this.set('isRunning', true);
        }
      });

      this.on('step', function () {
        tickAndRender(this);
      });

      this.on('toggle', function (evt, x, y) {
        var state = this.get('state');
        var cell = state[x][y];
        state[x][y] = cell ? 0 : 1;
        this.set('state', state);
      });

      this.observe('state', function (newValue, oldValue) {
        broadcaster.publish(newValue);
      });
    }
  });
}

function startTicking(initialState) {
  var currentState = initialState;
  return setInterval(
    tickAndRender.bind(null, ui),
    TICK_INTERVAL_MS
  );
}

function stopTicking(id) {
  clearInterval(id);
}

function tickAndRender(ui) {
  var currentState = ui.get('state'),
      newState;
  newState = tick(currentState);
  ui.set('state', newState);
  ui.add('generation');
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

  [x - 1, x, x + 1].forEach(function (currX) {
    [y - 1, y, y + 1].forEach(function (currY) {
      if (currX !== x || currY !== y) {
        if( state[currX] !== undefined && state[currX][currY] !== undefined) {
          num += state[currX][currY];
        }
      }
    });
  });

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
