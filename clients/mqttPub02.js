'use strict';

var mqtt = require('mqtt');

var clientId = 'mqttPub02';

var host = 'mqtt://192.168.0.101:2883';

var options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: false,
  reconnectPeriod: 1000 * 5,
  connectTimeout: 1000 * 30,
  retain: true,
  will: {
    topic: 'WillMsg',
    payload: 'Publisher connection Closed abnormally..!',
    qos: 1,
    retain: false
  }
};

var client = mqtt.connect(host, options);

client.on('error', function (err) {
  console.log(err);
  client.end();
});

client.on('connect', function () {
  console.log('client connected:' + clientId);
});

setInterval(function () {
  var d = new Date();
  var msg = d.toString();
  client.publish('clientTest', msg, { qos: 1, retain: false });
  console.log(clientId, msg);
}, 15000);

client.on('message', function (topic, message, packet) {
  console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic);
});

client.on('close', function () {
  console.log(clientId + ' disconnected');
});
