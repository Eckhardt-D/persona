import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(helmet());

app.get('/', (_, response) => {
  response.json({
    message: 'Hello 👋',
  });
});

export const runServer = () => {
  return new Promise((resolve, reject) => {
    try {
      app.listen(3001, () => {
        console.log('WWW server running on http://localhost:3001');
        return resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
};
