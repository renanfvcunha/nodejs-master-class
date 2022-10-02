/**
 * Example HTTP2 Server
 */

// Dependencies
import http2 from 'http2';

// Init the server
const server = http2.createServer();

// On a stream, send back hello world html
server.on('stream', (stream, headers) => {
  stream.respond({
    status: 200,
    'Content-Type': 'text/html',
  });

  stream.end('<html><body><p>Hello HTTP2!</p></body></html>');
});

// Listen on 6000
server.listen(6000);
