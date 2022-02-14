import {Sequelize} from 'sequelize';
import {dbPath} from './configs/db.config';

export const database = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath(),
});

export const connect = async (db: Sequelize) => {
  try {
    await db.sync();
    await db.authenticate({logging: false});
    return true;
  } catch ({message}) {
    throw Error('Database connect error: ' + message);
  }
};

export const disconnect = async (db: Sequelize) => {
  try {
    await db.close();
    return true;
  } catch ({message}) {
    throw Error('Database disconnect error: ' + message);
  }
};
