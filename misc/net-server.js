/**
 * Example TCP (Net) Server
 * Listens to port 6000 and sends the word "pong" to the client
 */

// Dependencies
import net from 'net';

// Create the server
const server = net.createServer(conn => {
  // Send the word "pong"
  const outboundMessage = 'pong';

  conn.write(outboundMessage);

  // When the client write something, log it out
  conn.on('data', inboundMessage => {
    const msgStr = inboundMessage.toString('utf-8');
    console.log(`I wrote ${outboundMessage} and they said ${msgStr}`);
  });
});

// Listen
server.listen(6000);
