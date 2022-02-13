import {
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import {userSchema} from '../schemas/user';

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

const init = (sequelize: Sequelize) => {
  UserModel.init(userSchema, {
    sequelize,
    modelName: 'users',
  });
  return UserModel;
};

export default init;
export const createUserModel = init;
