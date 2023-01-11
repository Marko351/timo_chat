import HTTP_STATUS from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { ISignUpData } from '@auth/interfaces/auth.interface';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { signupSchema } from '@auth/schemes/signup';
import { authService } from '@service/db/auth.service';
import { Helpers } from '@global/helpers/helpers';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserCache } from '@service/redis/user.cache';
import { omit } from 'lodash';
import JWT from 'jsonwebtoken';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';
import { config } from '@root/config';
import { loginSchema } from '@auth/schemes/signin';

export class SignIn {
  @joiValidation(loginSchema)
  static async read(req: Request, res: Response) {
    const { username, password } = req.body;

    const existingUser: IAuthDocument = await authService.getUserByUsername(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials');
    }

    const passwordsMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    const userJwt: string = JWT.sign(
      {
        userId: existingUser._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJwt };

    res.status(HTTP_STATUS.CREATED).json({ message: 'User login successfully!', user: existingUser, token: userJwt });
  }
}
