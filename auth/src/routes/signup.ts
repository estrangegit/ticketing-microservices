import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import {
  EMAIL_IS_ALREADY_IN_USE_ERROR_MESSAGE,
  EMAIL_MUST_BE_VALID_ERROR_MESSAGE,
  PASSWORD_MUST_BE_BETWEEN_4_and_20_CHARACTERS_ERROR_MESSAGE,
} from '../errors/error-message';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../model/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage(EMAIL_MUST_BE_VALID_ERROR_MESSAGE),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage(PASSWORD_MUST_BE_BETWEEN_4_and_20_CHARACTERS_ERROR_MESSAGE),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(EMAIL_IS_ALREADY_IN_USE_ERROR_MESSAGE);
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate the JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it to the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
