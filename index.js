import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

import './dataBase/db.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/', routes);

const port = process.env.PORT || 4444;
app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server START');
});
