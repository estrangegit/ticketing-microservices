import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  res.send('/api/users/signout route has been called');
});

export { router as signoutRouter };
