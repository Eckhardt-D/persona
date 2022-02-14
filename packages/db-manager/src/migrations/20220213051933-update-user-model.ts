import {QueryInterface} from 'sequelize';
import {userSchema} from '../schemas/user';

export default {
  async up(queryInterface: QueryInterface) {
    queryInterface.createTable('users', userSchema);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('users');
  },
};
