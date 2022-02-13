import envPaths from 'env-paths';
import {dbPath} from './db.config';

const dataPath = envPaths('persona').data;
const developmentPath = `${dataPath}/db.dev.sqlite`;
const testPath = `${dataPath}/db.test.sqlite`;
const productionPath = `${dataPath}/db.sqlite`;

describe('dbPath', () => {
  it('should have the correct path', async () => {
    expect(dbPath()).toBe(testPath);
  });

  it('should have the correct path', async () => {
    expect(dbPath('development')).toBe(developmentPath);
  });

  it('should have the correct path', async () => {
    expect(dbPath('')).toBe(developmentPath);
  });

  it('should have the correct path', async () => {
    expect(dbPath('production')).toBe(productionPath);
  });
});
