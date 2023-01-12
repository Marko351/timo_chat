import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('userCache');

export class UserCache extends BaseCache {
  constructor() {
    super('userCache');
  }

  public async saveUserToCache(key: string, userUId: string, createdUser: IUserDocument): Promise<void> {
    const createdAt = new Date();

    const firstsList: string[] = [
      '_id',
      `${createdUser._id}`,
      'uId',
      `${createdUser.uId}`,
      'username',
      `${createdUser.username}`,
      'email',
      `${createdUser.email}`,
      'avatarColor',
      `${createdUser.avatarColor}`,
      'createdAt',
      `${createdAt}`,
      'postsCount',
      `${createdUser.postsCount}`
    ];
    const secondList: string[] = [
      'blocked',
      JSON.stringify(createdUser.blocked),
      'blockedBy',
      JSON.stringify(createdUser.blockedBy),
      'profilePicture',
      `${createdUser.profilePicture}`,
      'followersCount',
      `${createdUser.followersCount}`,
      'followingCount',
      `${createdUser.followingCount}`,
      'notifications',
      JSON.stringify(createdUser.notifications),
      'social',
      JSON.stringify(createdUser.social)
    ];
    const thirdList: string[] = [
      'work',
      `${createdUser.work}`,
      'location',
      `${createdUser.location}`,
      'school',
      `${createdUser.school}`,
      'quote',
      `${createdUser.quote}`,
      'bgImageVersion',
      `${createdUser.bgImageVersion}`,
      'bgImageId',
      `${createdUser.bgImageId}`
    ];

    const dataToSave: string[] = [...firstsList, ...secondList, ...thirdList];

    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.ZADD('user', { score: parseInt(userUId, 10), value: `${key}` });
      await this.client.HSET(`users:${key}`, dataToSave);
    } catch (err) {
      log.error(err);
      throw new ServerError('Server error. Try again!');
    }
  }

  public async getUserFromCache(key: string): Promise<IUserDocument | null> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const response: IUserDocument = (await this.client.HGETALL(`users:${key}`)) as unknown as IUserDocument;
      response.createdAt = new Date(Helpers.parseJson(`${response.createdAt}`));
      response.postsCount = Helpers.parseJson(`${response.postsCount}`);
      response.blocked = Helpers.parseJson(`${response.blocked}`);
      response.blockedBy = Helpers.parseJson(`${response.blockedBy}`);
      response.notifications = Helpers.parseJson(`${response.notifications}`);
      response.social = Helpers.parseJson(`${response.social}`);
      response.followersCount = Helpers.parseJson(`${response.followersCount}`);
      response.followingCount = Helpers.parseJson(`${response.followingCount}`);

      return response;
    } catch (err) {
      log.error(err);
      throw new ServerError('Server error. Try again!');
    }
  }
}
