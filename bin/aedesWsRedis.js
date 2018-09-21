'use strict';

const redis = require('mqemitter-redis');

let config = {
  mqtt_port: 2883,
  ws_port: 8888,
  redis_port: 6379,
  redis_host: '192.168.0.101',
  redis_pass: 'carson',
  redis_dbA: 0,
  redis_dbB: 1
};

const mq = redis({
  port: config.redis_port,
  host: config.redis_host,
  password: config.redis_pass,
  db: config.redis_dbA,
  family: 4
});

const persistence = require('aedes-persistence-redis')({
  port: config.redis_port,
  host: config.redis_host,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: config.redis_pass,
  db: config.redis_dbA,

  maxSessionDelivery: 6000 // maximum offline messages deliverable on client CONNECT, default is 1000
  // packetTTL: function (packet) { // offline message TTL, default is disabled
  //  return 10; // seconds
});

let aedesOptions = {mq, persistence, concurrency: 200};

let aedes = require('aedes')(aedesOptions);
let server = require('net').createServer(aedes.handle);
let ws = require('websocket-stream');

server.listen(config.mqtt_port, function () {
  console.log('MQTT server listening on port', config.mqtt_port);
});

ws.createServer({ server: server }, aedes.handle);

server.listen(config.ws_port, function () {
  console.log('WS server listening on port', config.ws_port);
});

aedes.on('client', function (client) {
  console.log('new client', client.id);
});

aedes.on('connackSent', function (client) {
  console.log('sent connack to %s', client.id);
});

aedes.on('subscribe', function (subscriptions, client) {
  if (client) {
    console.log('%s subscribe %s', subscriptions, client.id);
  }
});

aedes.on('clientError', function (client, err) {
  console.log('client error', client.id, err.message, err.stack);
});

aedes.on('connectionError', function (client, err) {
  console.log('client error: client: %s, error: %s', client.id, err.message);
});

aedes.on('publish', function (packet, client) {
  if (client) {
    console.log('%s : topic %s : %s', client.id, packet.topic, packet.payload);
  }
});

aedes.on('ack', function (message, client) {
  console.log('%s ack\'d message', client.id);
});

aedes.on('clientDisconnect', function (client) {
  console.log('%s disconnected', client.id);
});
