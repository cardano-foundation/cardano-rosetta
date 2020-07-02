import { DefaultBody } from 'fastify';

// eslint-disable-next-line @typescript-eslint/ban-types
type Services = { [index: string]: Function };

/**
 * As `fastify-openapi-glue provides an instance of FastifyRequest when invoking the handler
 * but the service layer only needs the request body this wrapper function acts as a controller
I * adapting both interfaces
 */
const wrap = function wrap(services: Services): Services {
  return Object.keys(services).reduce(
    (accumulator, method) => ({
      ...accumulator,
      [method]: (request: { body: DefaultBody }) => services[method](request.body)
    }),
    {}
  );
};

export { wrap };
