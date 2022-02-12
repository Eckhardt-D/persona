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

  it('returns undefined for unknown', async () => {
    const user = await new User().getById({id: 'unknownId'});
    expect(user).toBeUndefined();
  });
});

describe('getByGitubId', () => {
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

  it('gets user by githubId', async () => {
    const user = await new User().getByGithubId({githubId: '12345678'});
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

  it('returns undefined for unknown', async () => {
    const user = await new User().getByGithubId({githubId: 'unknownId'});
    expect(user).toBeUndefined();
  });
});

describe('updateById', () => {
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

  it('updates user', async () => {
    const user = await new User().updateById({id, name: 'New Name'});
    expect(user).toStrictEqual({
      id,
      name: 'New Name',
      email: 'test@test.com',
      githubId: '12345678',
      website: null,
      bio: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: null,
    });
  });

  it('throws if none affected', async () => {
    await expect(
      new User().updateById({
        id: 'unknownId',
        name: 'Something',
      })
    ).rejects.toThrow('Could not update user with id "unknownId"');
  });

  it('throws without min params', async () => {
    await expect(
      new User().updateById({
        id: 'unknownId',
      })
    ).rejects.toThrow('"value" must contain at least one of [');
  });

  it('updates multiple params', async () => {
    await expect(
      new User().updateById({
        id,
        name: 'new name',
        email: 'new@email.com',
      })
    ).resolves.toStrictEqual({
      id,
      name: 'new name',
      email: 'new@email.com',
      githubId: '12345678',
      website: null,
      bio: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: null,
    });
  });

  it('updates all params', async () => {
    await expect(
      new User().updateById({
        id,
        name: 'new name',
        email: 'new@email.com',
        website: 'https://site.com',
        bio: 'I does codes',
        profileImage: 'https://path.to.image.png',
      })
    ).resolves.toStrictEqual({
      id,
      name: 'new name',
      email: 'new@email.com',
      githubId: '12345678',
      website: 'https://site.com',
      bio: 'I does codes',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: 'https://path.to.image.png',
    });
  });
});
