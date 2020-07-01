import { FastifyRequest } from 'fastify';

/**
 * As `fastify-openapi-glue provides an instance of FastifyRequest when invoking the handler
 * but the service layer only needs the request body this wrapper function acts as a controller
 * adapting both interfaces
 */
export function wrap(services: { [index: string]: Function }) {
  return Object.keys(services).reduce((acc, method) => {
    return {
      ...acc,
      [method]: (req: FastifyRequest) => services[method](req.body),
    };
  }, {});
}
