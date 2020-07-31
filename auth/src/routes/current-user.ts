import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send('/api/users/currentuser route has been called');
});

export { router as currentUserRouter };
