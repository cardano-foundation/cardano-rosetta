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
  noAdditional: true,
});

const start = async () => {
  try {
    await server.listen(3000, '0.0.0.0');
    server.blipp();
  } catch (err) {
    console.log(err);
    server.log.error(err);
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error(error);
});
process.on('unhandledRejection', (error) => {
  console.error(error);
});

start();
