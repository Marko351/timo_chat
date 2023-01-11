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

const userCahche: UserCache = new UserCache();

export class SignUp {
  @joiValidation(signupSchema)
  static async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;

    const checkIfUserExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);

    if (checkIfUserExists) {
      throw new BadRequestError('Invalid Credentials');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRandomIntegers(12)}`;
    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor
    });
    const cludinaryResult: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;

    if (!cludinaryResult?.public_id) {
      throw new BadRequestError('File upload: Error occurred, try again.');
    }

    // Add to user cache
    const userDataForCache: IUserDocument = SignUp.userData(authData, userObjectId);
    userDataForCache.profilePicture = `https://res.cloudinary.com/dt5lgaara/image/upload/v${cludinaryResult.version}/${userObjectId}`;
    await userCahche.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // Add to queue
    authQueue.addAuthUserJob('addAuthUserToDB', { value: userDataForCache });
    userQueue.addUserJob('addUserToDB', { value: userDataForCache });

    const userJwt: string = SignUp.signToken(authData, userObjectId);
    req.session = { jwt: userJwt };

    res.status(HTTP_STATUS.CREATED).json({ message: 'User created!', user: userDataForCache, token: userJwt });
  }

  private static signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, username, email, uId, password, avatarColor } = data;

    return {
      _id,
      uId,
      username: Helpers.firstLetterUpercase(username),
      email: email.toLowerCase(),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }

  private static userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, username, email, uId, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUpercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
