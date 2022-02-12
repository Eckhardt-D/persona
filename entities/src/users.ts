import Joi from 'joi';
import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import database from './database';

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
  email: Joi.string().email(),
  githubId: Joi.string().required(),
  bio: Joi.string().default(null),
  website: Joi.string().uri().default(null),
  profileImage: Joi.string().uri().default(null),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
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
  static async toUser(user: UserModel) {
    const validatedUser = await databaseUserSchema.validateAsync(user);
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

  async getById() {
    throw new Error('nothing');
  }

  async getByGithubId() {
    throw new Error('nothing');
  }

  async updateById() {
    throw new Error('nothing');
  }

  async create() {
    throw new Error('nothing');
  }
}
