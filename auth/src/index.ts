import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req, res) => {
  res.send('/api/users/currentuser route has been called with get HTTP method');
});

app.listen(3000, () => {
  console.log('auth service is listening on port 3000');
});
