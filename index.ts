#!/usr/bin/env node
import { logger } from '@/config/pino';

process.on('uncaughtException', (err) => {
  logger.fatal(
    `\nUncaught Exception: ${err.message}\nException Stack Trace: ${err.stack}`,
  );

  process.exit(1);
});

/**
 * Module dependencies.
 */

import app from '@/app';
import http from 'http';
import debug from 'debug';
import { ENV } from '@/config/environment';

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (port: number) => {
  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 */

const onError = (err: NodeJS.ErrnoException) => {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (err.code) {
    case 'EACCES':
      logger.fatal(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.fatal(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw err;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  log('Listening on ' + bind);
};

const log = debug('express-service:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(ENV.APP_PORT || 3000);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
server.on('error', onError);
server.on('listening', onListening);

process.on('unhandledRejection', (err) => {
  logger.fatal(`\nUnhandled Rejection: ${err}`);

  // shutdown the server gracefully
  server.close(() => {
    process.exit(1); // then exit
  });

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => {
    // exit immediately and generate a core dump file
    process.abort();
  }, 3000).unref();

  process.exit(1);
});
