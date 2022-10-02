/**
 * Example TCP (Net) Client
 * Connects to port 6000 and sends the word "ping" to servers
 */

// Dependencies
import net from 'net';

// Define the message to send
const outboundMessage = 'ping';

// Create the client
const client = net.createConnection(
  {
    port: 6000,
  },
  () => {
    // Send the message
    client.write(outboundMessage);
  },
);

// When the server writes back, log what it says then kill the client
client.on('data', inboundMessage => {
  const msgStr = inboundMessage.toString();
  console.log(`I wrote ${outboundMessage} and they said ${msgStr}`);

  client.end();
});
