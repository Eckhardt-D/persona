import {QueryInterface, DataTypes} from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    queryInterface.createTable('users', {
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
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('users');
  },
};
