import Fastify, {FastifyInstance} from 'fastify';
import {User} from '@persona/entities';
import {v4 as uuid} from 'uuid';

const server: FastifyInstance = Fastify({});

class ResponseError extends Error {
  declare statusCode: number;
  constructor(message?: string) {
    super(message);
  }
}

const functionToSwallowError = (err: unknown) => {
  return err;
};

server.get('/', async () => {
  const userModel = new User();
  try {
    await userModel.create({
      id: uuid(),
      githubId: '123456',
      name: 'Testing',
      email: 'eckhardt@kaizen.com',
    });
    // eslint-disable-next-line
  } catch (error) {
    functionToSwallowError(error);
  }

  const user = await userModel.getByGithubId({githubId: '123456'});

  if (user === undefined) {
    const err = new ResponseError();
    err.statusCode = 404;
    err.message = 'Could not find user with id "123456"';
    throw err;
  }

  return user;
});

const start = async () => {
  try {
    await server.listen(3002);

    // const address = server.server.address();
    // const port = typeof address === 'string' ? address : address?.port;
  } catch (error) {
    server.log.error(error);
    throw error;
  }
};

start();
