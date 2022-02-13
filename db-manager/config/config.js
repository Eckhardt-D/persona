'use strict';
const {dbPath} = require('@persona/entities/build/src/configs/db.config');

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
