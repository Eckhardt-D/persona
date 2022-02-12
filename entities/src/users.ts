import Joi from 'joi';
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import {database} from './database';

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare githubId: string;
  declare bio: CreationOptional<string>;
  declare website: CreationOptional<string>;
  declare profileImage: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

const databaseUserSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
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
  email?: string;
  profileImage?: string;
  bio?: string;
  website?: string;
}

const updateByIdOptionsSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  profileImage: Joi.string().optional(),
  bio: Joi.string().optional(),
  website: Joi.string().optional(),
})
  .or('name', 'email', 'profileImage', 'bio', 'webpage')
  .required();

export interface UserAddOptions {
  id: string;
  githubId: string;
  name: string;
  email: string;
  profileImage?: string;
}

const addOptionsSchema = Joi.object({
  id: Joi.string().required(),
  githubId: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().required(),
  profileImage: Joi.string().optional(),
}).required();

UserModel.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
    },
    githubId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    sequelize: database,
  }
);

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

    const [count] = await UserModel.update(params, {
      where: {
        id: params.id,
      },
      logging: false,
    });

    if (count < 1) {
      throw new Error(`Could not update user with id "${params.id}"`);
    }

    return this.getById({id: params.id});
  }

  async create() {
    throw new Error('nothing');
  }
}
