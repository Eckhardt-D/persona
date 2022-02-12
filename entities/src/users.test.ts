import {User, UserModel} from '.';
import {database, connect, disconnect} from './database';
import {v4 as uuid} from 'uuid';

beforeAll(async () => {
  await connect(database);
});

afterAll(async () => {
  await disconnect(database);
});

describe('getUserById', () => {
  let id: string;

  beforeAll(async () => {
    id = uuid();

    await UserModel.sync({
      logging: false,
    });

    await UserModel.create(
      {
        id,
        name: 'Test User',
        email: 'test@test.com',
        githubId: '12345678',
      },
      {logging: false}
    );
  });

  afterAll(async () => {
    await UserModel.destroy({
      where: {
        id,
      },
      logging: false,
    });
  });

  it('gets a user by id', async () => {
    const user = await new User().getById({id});
    expect(user).toStrictEqual({
      id,
      name: 'Test User',
      email: 'test@test.com',
      githubId: '12345678',
      website: null,
      bio: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: null,
    });
  });
});
