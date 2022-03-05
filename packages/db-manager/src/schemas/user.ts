import {DataTypes} from 'sequelize';

export const userSchema = {
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  githubId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customDomain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customDomainVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};
