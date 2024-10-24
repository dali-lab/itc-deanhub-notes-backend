import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import env from 'env-var';
import { RequestHandler } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { BaseError } from 'errors';
import { userService, verificationCodeService } from 'services';
import { User } from '@prisma/client';
import { RequestWithJWT } from 'auth/requests';
import { SignUpUserRequest,  ResendCodeRequest, VerifyUserRequest } from 'validation/auth';
import { sendEmail } from 'util/email';
import { SCOPES } from 'auth/scopes';

dotenv.config();

const tokenForUser = (user: Omit<User, 'password'>): string => {
  const timestamp = new Date().getTime();
  const exp = Math.round((timestamp + 2.628e+9) / 1000);
  return jwt.encode({ sub: user.id, iat: timestamp, exp }, env.get('AUTH_SECRET').required().asString());
};

const signUpUser: RequestHandler = async (req: ValidatedRequest<SignUpUserRequest>, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;

    // Make a new user from passed data
    const savedUser = await userService.createUser({
      email,
      password,
      name,
      role: SCOPES.UNVERIFIED.name,
    });

    // Save the user then transmit to frontend
    res.status(201).json({ token: tokenForUser(savedUser), user: savedUser });
  } catch (error) {
    next(error);
  }
};

const signInUser: RequestHandler = (req: RequestWithJWT, res) => {
  console.log('req.user', req.user);
  const { password, ...restOfUser } = req.user;

  res.json({ token: tokenForUser(req.user), user: restOfUser });
};

const jwtSignIn: RequestHandler = (req: RequestWithJWT, res) => {
  const { password, ...restOfUser } = req.user;

  res.json({ user: restOfUser });
};

const resendCode: RequestHandler = async (req: ValidatedRequest<ResendCodeRequest>, res, next) => {
  try {
    const {
      email,
    } = req.body;

    const users = await userService.getUsers({ email });
    if (users.length === 0) throw new BaseError('No user with that phone number', 400);

    await verificationCodeService.createVerificationCode({ email });
    const codePayload = await verificationCodeService.createVerificationCode({ email });
    const message = `You must enter this code in the app before you can gain access; it will expire in 5 minutes. Your code is: ${codePayload.code}`;
    await sendEmail({ email, subject: 'Verification Code', html: message });

    res.sendStatus(201);
  } catch (e: any) {
    console.log(e);
    next(e);
  }
};

const verifyUser: RequestHandler = async (req: ValidatedRequest<VerifyUserRequest>, res, next) => {
  try {
    const {
      email, code,
    } = req.body;

    const user = await verificationCodeService.verifyVerificationCode(email, code);

    res.status(200).json({ token: tokenForUser(user), user });
  } catch (error : any) {
    console.log(error);
    next(error);
  }
};

const authController = {
  signUpUser,
  signInUser,
  jwtSignIn,
  resendCode,
  verifyUser,
};

export default authController;
