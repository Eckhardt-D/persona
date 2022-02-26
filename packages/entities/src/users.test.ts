import {User} from '.';
import {createUserModel, UserModel} from '@persona/db-manager';
import {database, connect, disconnect} from './database';
import {v4 as uuid} from 'uuid';

beforeAll(async () => {
  createUserModel(database);
  await connect(database);
});

afterAll(async () => {
  await UserModel.drop();
  await disconnect(database);
});

describe('getUserById', () => {
  let id: string;

  beforeAll(async () => {
    id = uuid();

    await UserModel.create(
      {
        id,
        name: 'Test User',
        username: 'TestUser',
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
      username: 'TestUser',
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

    await UserModel.create(
      {
        id,
        name: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        githubId: 'uniqueghid',
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
    const user = await new User().getByGithubId({githubId: 'uniqueghid'});
    expect(user).toStrictEqual({
      id,
      name: 'Test User',
      username: 'testuser',
      email: 'test@test.com',
      githubId: 'uniqueghid',
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

    await UserModel.create(
      {
        id,
        name: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        githubId: 'uniquegithubid2',
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
      username: 'testuser',
      email: 'test@test.com',
      githubId: 'uniquegithubid2',
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
      username: 'testuser',
      githubId: 'uniquegithubid2',
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
        username: 'testuser2',
        website: 'https://site.com',
        bio: 'I does codes',
        profileImage: 'https://path.to.image.png',
      })
    ).resolves.toStrictEqual({
      id,
      name: 'new name',
      email: 'new@email.com',
      username: 'testuser2',
      githubId: 'uniquegithubid2',
      website: 'https://site.com',
      bio: 'I does codes',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: 'https://path.to.image.png',
    });
  });

  it('throws if duplicate', async () => {
    const secondId = uuid();

    await UserModel.create(
      {
        id: secondId,
        name: 'Test User2',
        username: 'testuser255',
        email: 'test2@test.com',
        githubId: '123456789',
      },
      {logging: false}
    );

    await expect(
      new User().updateById({
        id,
        email: 'test2@test.com',
      })
    ).rejects.toThrow('email must be unique');

    await UserModel.destroy({
      where: {
        id: secondId,
      },
      logging: false,
    });
  });

  it('throws if duplicate', async () => {
    const secondId = uuid();

    await UserModel.create(
      {
        id: secondId,
        name: 'Test User2',
        username: 'testuser',
        email: 'test4@test.com',
        githubId: '12345678933',
      },
      {logging: false}
    );

    await expect(
      new User().updateById({
        id,
        email: 'test2@test.com',
        username: 'testuser',
      })
    ).rejects.toThrow('username must be unique');

    await UserModel.destroy({
      where: {
        id: secondId,
      },
      logging: false,
    });
  });
});

describe('create', () => {
  let id: string;

  beforeAll(async () => {
    id = uuid();
  });

  afterEach(async () => {
    await UserModel.destroy({
      where: {
        id,
      },
      logging: false,
    });
  });

  it('creates a new user', async () => {
    const user = await new User().create({
      id,
      email: 'new@mail.com',
      username: 'testing',
      name: 'Testing',
      githubId: '12345678',
    });

    expect(user).toStrictEqual({
      id,
      name: 'Testing',
      username: 'testing',
      email: 'new@mail.com',
      githubId: '12345678',
      website: null,
      bio: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: null,
    });
  });

  it('creates a new user with image', async () => {
    const user = await new User().create({
      id: id,
      email: 'another@mail.com',
      username: 'testing',
      name: 'Testing',
      githubId: '123456',
      profileImage: 'https://path.to/image.png',
    });

    expect(user).toStrictEqual({
      id: id,
      name: 'Testing',
      email: 'another@mail.com',
      username: 'testing',
      githubId: '123456',
      website: null,
      bio: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      profileImage: 'https://path.to/image.png',
    });
  });

  it('throws if duplicate ghId', async () => {
    const uniqueId = uuid();

    await new User().create({
      id: uniqueId,
      email: 'another2@mail.com',
      name: 'Testing',
      username: 'testing2',
      githubId: '12345688',
      profileImage: 'https://path.to/image.png',
    });

    await expect(
      new User().create({
        id: uuid(),
        email: 'uuid@mail.com',
        name: 'Testing2',
        username: 'testing23',
        githubId: '12345688',
        profileImage: 'https://path.to/image.png',
      })
    ).rejects.toThrow('githubId must be unique');
  });

  it('throws error without duplicate', async () => {
    const mocked = jest.spyOn(User, 'toUser').mockImplementation(() => {
      throw new Error('Failed to create.');
    });

    await expect(
      new User().create({
        id: uuid(),
        email: 'uuid2@mail.com',
        name: 'Testing3',
        username: 'testing3',
        githubId: '12345689',
        profileImage: 'https://path.to/image.png',
      })
    ).rejects.toThrow('failed to create user');

    expect(mocked).toHaveBeenCalled();
  });
});
