import envPaths from 'env-paths';

const dataPath = envPaths('persona').data;
const developmentPath = `${dataPath}/db.dev.sqlite`;
const testPath = `${dataPath}/db.test.sqlite`;
const productionPath = `${dataPath}/db.sqlite`;

export const dbPath = (environment = process.env.NODE_ENV) =>
  !environment || environment === 'development'
    ? developmentPath
    : environment === 'test'
    ? testPath
    : productionPath;
