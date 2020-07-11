import { DefaultBody } from 'fastify';

/**
 * As `fastify-openapi-glue provides an instance of FastifyRequest when invoking the handler
 * but the service layer only needs the request body this wrapper function acts as a controller
 * adapting both interfaces
 */
// eslint-disable-next-line @typescript-eslint/ban-types
const wrap = function wrap(services: NodeJS.Dict<Function>): NodeJS.Dict<Function> {
  return Object.keys(services).reduce(
    (accumulator, method) => ({
      ...accumulator,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: services[method] will never be undefined
      [method]: (request: { body: DefaultBody }) => services[method](request.body)
    }),
    {}
  );
};

export { wrap };
