import express from 'express';
import helmet from 'helmet';
import fetch from 'node-fetch';
import {join} from 'path';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.set('views', join(__dirname, './views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(join(__dirname, 'public')));

app.get('/:id', async (req, res) => {
  if (req.header('x-forwarded-for') !== 'static-azure')
    return res.redirect('https://azure.kaizen.com.na');

  const response = await fetch('http://localhost:3002/api/profile', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      id: req.params.id,
    }),
  }).then(res => res.json());

  if (response.error) {
    return res.redirect('https://azure.kaizen.com.na');
  }

  res.render('pages/index', response);
});

app.get('/', async (req, res) => {
  const domain = req.header('x-forwarded-for');

  if (domain === 'static-azure') {
    return res.redirect('https://azure.kaizen.com.na');
  }

  const response = await fetch(
    'http://localhost:3002/profile/domain?domain=' + domain
  ).then(res => res.json());

  if (response.error) {
    return res.redirect('https://azure.kaizen.com.na');
  }

  res.render('pages/index', response);
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
