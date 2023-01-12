import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { authService } from '@service/db/auth.service';
import JWT from 'jsonwebtoken';
import { config } from '@root/config';
import { loginSchema } from '@auth/schemes/signin';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';

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

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJwt };

    const userDocument: IUserDocument = {
      ...user,
      authId: existingUser!._id
    } as IUserDocument;

    res.status(HTTP_STATUS.CREATED).json({ message: 'User login successfully!', user: userDocument, token: userJwt });
  }
}
