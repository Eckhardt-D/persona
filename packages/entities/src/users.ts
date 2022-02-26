import Joi from 'joi';
import {InferAttributes} from 'sequelize';
import {createUserModel, UserModel} from '@persona/db-manager';
import {database} from './database';

createUserModel(database);

const databaseUserSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  githubId: Joi.string().required(),
  bio: Joi.string().allow(null),
  website: Joi.string().uri().allow(null),
  profileImage: Joi.string().uri().allow(null),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
}).required();

export interface IUser {
  id: string;
  name: string;
  username: string;
  email: string;
  githubId: string;
  bio: string | null;
  website: string | null;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserGetByIdOptions {
  id: string;
}

const getByIdOptionsSchema = Joi.object({
  id: Joi.string().required(),
});

export interface UserGetByGithubIdOptions {
  githubId: string;
}

const getByGithubIdOptionsSchema = Joi.object({
  githubId: Joi.string().required(),
}).required();

export interface UserUpdateByIdOptions {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  website?: string;
}

const updateByIdOptionsSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  username: Joi.string().optional(),
  email: Joi.string().optional(),
  profileImage: Joi.string().optional(),
  bio: Joi.string().optional(),
  website: Joi.string().optional(),
})
  .or('name', 'email', 'profileImage', 'bio', 'webpage', 'username')
  .required();

export interface UserAddOptions {
  id: string;
  githubId: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
}

const addOptionsSchema = Joi.object({
  id: Joi.string().uuid({version: 'uuidv4'}).required(),
  githubId: Joi.string().required(),
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  profileImage: Joi.string().uri().optional(),
}).required();

export class User {
  static async toUser(user: InferAttributes<UserModel>) {
    const validatedUser = await databaseUserSchema.validateAsync(user, {
      stripUnknown: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};

    data.id = validatedUser.id;
    data.githubId = validatedUser.githubId;
    data.name = validatedUser.name;
    data.email = validatedUser.email;
    data.username = validatedUser.username;
    data.website = validatedUser.website || null;
    data.bio = validatedUser.bio || null;
    data.createdAt = validatedUser.createdAt;
    data.updatedAt = validatedUser.updatedAt;
    data.profileImage = validatedUser.profileImage || null;
    return data;
  }

  async getById(options: UserGetByIdOptions): Promise<IUser | undefined> {
    const params = await getByIdOptionsSchema.validateAsync(options, {
      stripUnknown: true,
    });

    const user = await UserModel.findOne({
      where: {
        id: params.id,
      },
      logging: false,
    });

    if (!user) {
      return undefined;
    }

    return User.toUser(user.get({plain: true}));
  }

  async getByGithubId(
    options: UserGetByGithubIdOptions
  ): Promise<IUser | undefined> {
    const params = await getByGithubIdOptionsSchema.validateAsync(options, {
      stripUnknown: true,
    });

    const user = await UserModel.findOne({
      where: {
        githubId: params.githubId,
      },
      logging: false,
    });

    if (!user) {
      return undefined;
    }

    return User.toUser(user.get({plain: true}));
  }

  async updateById(options: UserUpdateByIdOptions): Promise<IUser | undefined> {
    const params = (await updateByIdOptionsSchema.validateAsync(options, {
      stripUnknown: true,
    })) as UserUpdateByIdOptions;

    const paramsCopy = {...params, id: undefined};

    try {
      const [count] = await UserModel.update(paramsCopy, {
        where: {
          id: params.id,
        },
        logging: false,
      });

      if (count < 1) {
        throw new Error(`Could not update user with id "${params.id}"`);
      }

      return this.getById({id: params.id});
    } catch ({message, name, errors}) {
      if (name === 'SequelizeUniqueConstraintError') {
        throw new Error((errors as {message: string}[])[0].message);
      }

      throw new Error(message as string);
    }
  }

  async create(options: UserAddOptions): Promise<IUser> {
    const params = (await addOptionsSchema.validateAsync(options, {
      stripUnknown: true,
    })) as UserAddOptions;

    try {
      const result = await UserModel.create(params);
      return User.toUser(result.get({plain: true}));
    } catch ({name, errors}) {
      if (name === 'SequelizeUniqueConstraintError') {
        throw new Error((errors as {message: string}[])[0].message);
      }
      throw new Error('failed to create user');
    }
  }
}
