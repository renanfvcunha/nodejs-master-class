/**
 * Example UDP Server
 * Create a UDP datagram server listening on 6000
 */

// Dependencies
import dgram from 'dgram';

// Create a server
const server = dgram.createSocket('udp4');

server.on('message', (msgBuffer, sender) => {
  // Do something with an incoming message or do something with the sender
  const msgString = msgBuffer.toString('utf-8');

  console.log(msgString);
});

// Bind to 6000
server.bind(6000);
