/**
 * Example UDP Client
 * Sending a message to a UDP Server on port 6000
 */

import dgram from 'dgram';

// Create the client
const client = dgram.createSocket('udp4');

// Define the message and pull it into a buffer
const msgString = 'This is a message';
const msgBuffer = Buffer.from(msgString);

// Send off the message
client.send(msgBuffer, 6000, 'localhost', () => {
  client.close();
});
