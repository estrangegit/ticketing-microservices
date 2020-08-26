import jwt from 'jsonwebtoken';

const signin = (email: string) => {
  const userJwt = jwt.sign(
    {
      id: 1,
      email: email,
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
