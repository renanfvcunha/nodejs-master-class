/**
 * Example TLS Client
 * Connects to port 6000 and sends the word "ping" to servers
 */

// Dependencies
import tls from 'tls';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dirName = path.dirname(fileURLToPath(import.meta.url));

// Server options
const options = {
  // Only required because we're using a self-signed certificate
  ca: fs.readFileSync(path.join(dirName, '..', 'https', 'cert.pem')),
};

// Define the message to send
const outboundMessage = 'ping';

// Create the client
const client = tls.connect(6000, options, () => {
  // Send the message
  client.write(outboundMessage);
});

// When the server writes back, log what it says then kill the client
client.on('data', inboundMessage => {
  const msgStr = inboundMessage.toString();
  console.log(`I wrote ${outboundMessage} and they said ${msgStr}`);

  client.end();
});
