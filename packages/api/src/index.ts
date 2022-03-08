import Fastify, {FastifyInstance} from 'fastify';
import {User, UserAddOptions} from '@persona/entities';
import {v4 as uuid} from 'uuid';
import cors from 'fastify-cors';
import {config} from 'dotenv';
import {StateManager} from './modules/StateManager';
import {GitHub} from './modules/GitHub';
import fileUpload from 'fastify-file-upload';
import {Firebase} from './modules/Firebase';
import {UploadedFile} from './typings/UploadedFile';

config();

const server: FastifyInstance = Fastify({});
const stateManager: StateManager = new StateManager();

const githubSDK: GitHub = new GitHub({
  client_id: process.env.GH_CLIENT_ID as string,
  client_secret: process.env.GH_CLIENT_SECRET as string,
});

const firebase: Firebase = new Firebase({
  privateKeyPath: process.env.FB_CERT_PATH as string,
});

server.register(cors, {
  origin: ['http://localhost:3000', 'https://azure.kaizen.com.na'],
});

server.register(fileUpload, {
  limits: {fileSize: 512000},
});

server.get(
  '/api/state',
  {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            state: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  async () => {
    const state = uuid();
    stateManager.add(state);
    return {
      success: true,
      state,
    };
  }
);

server.post<{Body: {token: string}}>(
  '/api/token/validate',
  {
    schema: {
      body: {
        token: {
          type: 'string',
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: {type: 'string'},
            name: {type: 'string'},
            username: {type: 'string'},
            email: {type: 'string'},
            githubId: {type: 'string'},
            bio: {type: ['string', 'null']},
            website: {type: ['string', 'null']},
            profileImage: {type: ['string', 'null']},
            customDomain: {type: ['string', 'null']},
            customDomainVerfied: {type: 'boolean'},
            createdAt: {type: 'string'},
            updatedAt: {type: 'string'},
          },
        },
        401: {
          error: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
              },
              message: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const {token} = request.body;

    try {
      const githubUser = await githubSDK.getUserByToken({token});
      const id = githubUser.id;

      if (!id) {
        throw new Error();
      }

      const user = await new User().getByGithubId({
        githubId: id.toString(),
      });

      if (!user) {
        const githubEmail = await githubSDK.getUserEmailByLogin({token});

        if (!githubEmail) {
          throw new Error();
        }

        // create the new user.
        const userRecord: UserAddOptions = {
          id: uuid(),
          email: githubEmail,
          name: githubUser.name,
          githubId: githubUser.id.toString(),
          profileImage: githubUser.avatar_url,
          username: githubUser.login,
        };

        const insertedUser = await new User().create(userRecord);
        return insertedUser;
      }

      return user;
    } catch (error) {
      reply.code(400);
      return {
        error: {
          statusCode: 400,
          message: 'Failed to verify user token',
        },
      };
    }
  }
);

server.post<{Body: {code: string; state: string}}>(
  '/api/authorize',
  {
    schema: {
      body: {
        code: {
          type: 'string',
        },
        state: {
          type: 'string',
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
        400: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                },
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
  async (request, reply) => {
    const {code, state} = request.body;

    const csrfError = {
      error: {
        statusCode: 400,
        message: 'Possible CSRF attack, denied.',
      },
    };

    if (typeof state === undefined) {
      reply.code(400);
      return csrfError;
    }

    const verified = stateManager.verify(state);

    if (!verified) {
      reply.code(400);
      return csrfError;
    }

    stateManager.del(state);

    const token = await githubSDK.getToken({code});

    if (!token) {
      reply.code(400);
      return {
        error: {
          statusCode: 400,
          message: 'Could not verify your account',
        },
      };
    }

    return {
      token,
    };
  }
);

server.patch<{Body: {id: string; update: {[key: string]: unknown}}}>(
  '/api/profile',
  {
    schema: {
      body: {
        id: {
          type: 'string',
        },
        update: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            username: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            profileImage: {
              type: 'string',
            },
            bio: {
              type: 'string',
            },
            website: {
              type: 'string',
            },
            customDomain: {
              type: 'string',
            },
            customDomainVerified: {
              type: 'boolean',
            },
          },
        },
      },
      response: {
        200: {
          id: {type: 'string'},
          name: {type: 'string'},
          username: {type: 'string'},
          email: {type: 'string'},
          githubId: {type: 'string'},
          bio: {type: ['string', 'null']},
          website: {type: ['string', 'null']},
          profileImage: {type: ['string', 'null']},
          createdAt: {type: 'string'},
          updatedAt: {type: 'string'},
          customDomain: {type: ['string', 'null']},
          customDomainVerified: {type: 'boolean'},
        },
      },
    },
  },
  async request => {
    const {id, update} = request.body;

    try {
      const user = await new User().updateById({
        id,
        ...update,
      });

      return user;
    } catch ({message}) {
      return {
        error: {
          statusCode: 500,
          message: message as string,
        },
      };
    }
  }
);

server.post<{Body: {id: string}}>(
  '/api/profile',
  {
    schema: {
      body: {
        id: {
          type: 'string',
        },
      },
      response: {
        200: {
          id: {type: 'string'},
          name: {type: 'string'},
          username: {type: 'string'},
          bio: {type: ['string', 'null']},
          profileImage: {type: ['string', 'null']},
        },
      },
    },
  },
  async request => {
    const {id} = request.body;

    if (!id) throw new Error('User not found');

    try {
      const user = await new User().getById({
        id,
      });

      return {
        id: user?.id,
        name: user?.name,
        bio: user?.bio,
        username: user?.username,
        profileImage: user?.profileImage,
      };
    } catch ({message}) {
      return {
        error: {
          statusCode: 500,
          message: message as string,
        },
      };
    }
  }
);

server.post<{Body: {file: unknown}}>(
  '/api/profile/image',
  {
    schema: {
      body: {
        type: 'object',
        properties: {
          file: {
            type: 'object',
          },
        },
        required: ['file'],
      },
      response: {
        200: {
          url: {
            type: 'string',
          },
        },
      },
    },
  },
  async request => {
    const file = request.body.file as UploadedFile;

    const url = await firebase.uploadProfileImageAndGetPath({
      file,
    });

    return {
      url,
    };
  }
);

server.post<{Body: {domain: string; id: string}}>(
  '/api/domain/add',
  {
    schema: {
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          domain: {
            type: ['string', 'null'],
          },
        },
      },
      response: {
        200: {
          id: {type: 'string'},
          name: {type: 'string'},
          username: {type: 'string'},
          email: {type: 'string'},
          githubId: {type: 'string'},
          bio: {type: ['string', 'null']},
          website: {type: ['string', 'null']},
          profileImage: {type: ['string', 'null']},
          createdAt: {type: 'string'},
          updatedAt: {type: 'string'},
          customDomain: {type: ['string', 'null']},
          customDomainVerified: {type: 'boolean'},
        },
      },
    },
  },
  async request => {
    const {id, domain} = request.body;
    const user = await new User().updateById({id, customDomain: domain});
    return user;
  }
);

server.get('/domain/verify', async (request, reply) => {
  try {
    const {domain} = request.query as {domain: string};
    if (!domain) throw new Error('No domain found.');

    const user = await new User().getByDomain({domain});
    if (!user) {
      throw new Error('Domain does not exist');
    }

    new User().updateById({id: user.id, customDomainVerified: true});

    return reply.status(200).send();
  } catch ({message}) {
    return reply.status(500).send({
      error: {
        statusCode: 500,
        message,
      },
    });
  }
});

server.get('/profile/domain', async (request, reply) => {
  try {
    const {domain} = request.query as {domain: string};
    if (!domain) throw new Error('No domain found.');

    const user = await new User().getByDomain({domain});
    if (!user) {
      throw new Error('Domain does not exist');
    }

    return {
      id: user?.id,
      name: user?.name,
      bio: user?.bio,
      username: user?.username,
      profileImage: user?.profileImage,
    };
  } catch ({message}) {
    return reply.status(500).send({
      error: {
        statusCode: 500,
        message,
      },
    });
  }
});

const start = async () => {
  try {
    console.log('Server listening on http://localhost:3002');
    await server.listen(3002);

    // const address = server.server.address();
    // const port = typeof address === 'string' ? address : address?.port;
  } catch (error) {
    server.log.error(error);
    throw error;
  }
};

start();
