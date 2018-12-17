/* eslint-disable no-console */
const dotenv = require('dotenv');
const path = require('path')

dotenv.load({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
})

const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);
