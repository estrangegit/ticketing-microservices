import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const signin = () => {
  const userJwt = jwt.sign(
    {
      id: mongoose.Types.ObjectId().toHexString(),
      email: 'test@test.com',
    },
    process.env.JWT_KEY!
  );

  const base64Jwt = new Buffer(
    JSON.stringify({
      jwt: userJwt,
    })
  ).toString('base64');

  return [`express:sess=${base64Jwt}`];
};

export { signin as signinHelper };
