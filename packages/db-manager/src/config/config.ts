import {dbPath} from '@persona/common';

module.exports = {
  development: {
    storage: dbPath(),
    database: 'persona_dev',
    dialect: 'sqlite',
  },
  test: {
    storage: dbPath(),
    database: 'persona_test',
    dialect: 'sqlite',
  },
  production: {
    storage: dbPath(),
    database: 'persona',
    dialect: 'sqlite',
  },
};
