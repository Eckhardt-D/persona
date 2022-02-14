import {database, connect, disconnect} from './database';

describe('database', () => {
  it('connects successfully', async () => {
    await expect(connect(database)).resolves.toBe(true);
  });

  it('disconnects successfully', async () => {
    await expect(disconnect(database)).resolves.toBe(true);
  });

  it('throws with invalid param', async () => {
    // @ts-ignore:TS2345
    await expect(connect(undefined)).rejects.toThrow('Database connect error:');
  });

  it('throws with invalid param', async () => {
    // @ts-ignore:TS2345
    await expect(disconnect(undefined)).rejects.toThrow(
      'Database disconnect error:'
    );
  });
});
