'use strict';

const mqtt = require('mqtt');

const mqttSubId = 'mqttSub01';

const host = 'mqtt://192.168.0.101:2883';

const options = {
  keepalive: 60,
  clientId: mqttSubId,
  protocolId: 'MQTT',
  protocolVersion: 4,
  clean: false,
  retain: false,
  reconnectPeriod: 1000 * 3,
  connectTimeout: 1000 * 30,
  will: {
    topic: 'WilllMsg',
    payload: 'Subscriber Connection Closed abnormally..!',
    qos: 1,
    retain: false
  }
};

const subscriptions = {'clientTest': 1};

const mqttclient = mqtt.connect(host, options);

mqttclient.on('connect', function () {
  console.log('%s mqtt client connected', mqttSubId);
//  mqttclient.subscribe({subs, mqttSubId});
});

mqttclient.subscribe({subscriptions, mqttSubId});

mqttclient.on('error', function (err) {
  console.log(err);
  mqttclient.end();
});

mqttclient.on('message', function (topic, message, packet) {
  console.log('%s Rec: %s Topic: %s', mqttSubId, message.toString(), topic);
});

mqttclient.on('offline', function () {
  console.log('offline');
});

mqttclient.on('close', function () {
  console.log(mqttSubId + ' disconnected');
});

mqttclient.on('reconnect', function () {
  console.log('reconnected: ', mqttSubId);
});
