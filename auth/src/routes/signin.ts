import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  res.send('/api/users/signin route has been called');
});

export { router as signinRouter };
