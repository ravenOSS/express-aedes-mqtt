# expresss-aedes-mqtt
Simple illustration of the integration of a mqtt broker to an Express.js server.
The Express server has been created using the Express CLI.
Express creates an HTTP server to which the aedes broker is attached.
Aedes is implemented with both mqtt and ws protocols.
For simplicity, the aedes code is located in the bin directory.
Requires installation of Redis for message persistence. 
Redis is intended to be, more or less, an in memory key:value store for high performance. Publisher's intent is that Redis will be used on the same machine as the operating program and the default install has no security. As such, it is usually used on the internal loopback interface 127.0.0.1 (aka localhost). 
However, the demo code is configured with an IP address and password. Note that the password should be in double quotes in config file. IP and password can be edited out.
When Redis is installed, a default configuration file is created (redis.conf) and can be found in the Redis install directory from where Redis can be started. Take a look at the Redis getting started docs.
Included in this repo is a publisher client and a couple of subscriber clients for basic testing.