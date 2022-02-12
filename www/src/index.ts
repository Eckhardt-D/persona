import {runServer} from './server';

runServer().catch(error => {
  console.error(error.message);
  process.exit(1);
});
