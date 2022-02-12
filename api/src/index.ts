import Fastify, {FastifyInstance, RouteShorthandOptions} from 'fastify';

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          pong: {
            type: 'string',
          },
        },
      },
    },
  },
};

server.get('/', opts, async (request, reply) => {
  return {pong: 'It worked!'};
});

const start = async () => {
  try {
    await server.listen(3002);

    // const address = server.server.address();
    // const port = typeof address === 'string' ? address : address?.port;
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
