/* eslint-disable no-console */
import fastify, { FastifyRequest } from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import openapiGlue from 'fastify-openapi-glue';
import services from './services';
import { wrap } from './controllers/generic-controller';

const server = fastify({ logger: true });

server.register(fastifyBlipp);
server.register(openapiGlue, {
  specification: `${__dirname}/openApi.json`,
  service: wrap(services),
  noAdditional: true
});

const PORT = 3000;

const start = async () => {
  try {
    await server.listen(PORT, '0.0.0.0');
    server.blipp();
  } catch (error) {
    console.log(error);
    server.log.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
};

process.on('uncaughtException', error => {
  console.error(error);
});
process.on('unhandledRejection', error => {
  console.error(error);
});

start();
