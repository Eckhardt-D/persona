import {QueryInterface, DataTypes} from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('users', 'customDomain', {
      type: DataTypes.STRING,
    });

    await queryInterface.addColumn('users', 'customDomainVerified', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('users', 'customDomain');
    await queryInterface.removeColumn('users', 'customDomainVerified');
  },
};
