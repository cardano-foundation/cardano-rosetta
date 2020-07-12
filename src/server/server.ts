import fastify from 'fastify';
import fastifyBlipp from 'fastify-blipp';
import openapiGlue from 'fastify-openapi-glue';
import StatusCodes from 'http-status-codes';
import { wrap } from './controllers/generic-controller';
import ApiError from './api-error';
import { Services } from './services/services';
import { Server, IncomingMessage, ServerResponse } from 'http';

/**
 * This function builds a Fastify instance connecting the services with the
 * corresponding fastify route handlers.
 *
 * @param services to be used to handle the requests
 * @param logger true if logger should be enabled, false otherwise
 */
const buildServer = (
  services: Services,
  logger = true
): fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> => {
  const server = fastify({ logger });

  server.register(fastifyBlipp);
  server.register(openapiGlue, {
    specification: `${__dirname}/openApi.json`,
    service: wrap(services),
    noAdditional: true
  });

  // Custom error handling is needed as the specified by Rosetta API doesn't match
  // the fastify default one
  server.setErrorHandler((error: Error, request, reply) => {
    request.log.error(error);
    if (error instanceof ApiError) {
      // rosseta-go-sdk always returns 500
      reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        ...error,
        message: error.message
      });
    } else reply.send(error);
  });

  return server;
};

export default buildServer;
