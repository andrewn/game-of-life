var mqtt = require('mqtt')
    Promise = require('es6-promise').Promise;

module.exports = function () {
  var topic = 'andrewn/game-of-life/state';
  var instance = {};

  var connectPromise = connect();

  instance.publish = function (msg) {
    var payload = JSON.stringify(msg);
    connectPromise.then(function (client) {
      client.publish(topic, payload, { retain: true });
    });
  };

  return instance;
}

function connect() {
  return new Promise(function (resolve, reject) {
    var client = mqtt.connect({
      host: 'test.mosquitto.org',
      protocol: 'ws',
      port: 8080
    });
    client.on('connect', resolve.bind(null, client));
  });
}
