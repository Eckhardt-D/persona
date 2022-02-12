import {Sequelize} from 'sequelize';
import {join} from 'path';

export const database = new Sequelize({
  dialect: 'sqlite',
  storage: join(__dirname, './data/db.sqlite'),
});

export const connect = async (db: Sequelize) => {
  try {
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
