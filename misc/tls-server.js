/**
 * Example TLS Server
 * Listens to port 6000 and sends the word "pong" to the clients
 */

// Dependencies
import tls from 'tls';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));

// Server options
const options = {
  key: fs.readFileSync(path.join(dirName, '..', 'https', 'key.pem')),
  cert: fs.readFileSync(path.join(dirName, '..', 'https', 'cert.pem')),
};

// Create the server
const server = tls.createServer(options, conn => {
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
