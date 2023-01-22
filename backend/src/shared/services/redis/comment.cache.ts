import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';
import { find } from 'lodash';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/helpers';
import { ICommentDocument } from '@comment/interfaces/comment.interface';

const log: Logger = config.createLogger('commentsCache');

export class CommentCache extends BaseCache {
  constructor() {
    super('commentsCache');
  }

  public async savePostCommentToCache(postId: string, value: string): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      await this.client.LPUSH(`comments:${postId}`, value);
      const commentsCount: string[] = await this.client.HMGET(`posts:${postId}`, 'commentsCount');
      let count: number = Helpers.parseJson(commentsCount[0]) as number;
      count += 1;

      const dataToSave: string[] = ['commentsCount', `${count}`];
      this.client.HSET(`posts:${postId}`, dataToSave);
    } catch (err) {
      log.error(err);
      throw new ServerError('Server error. Try again.');
    }
  }

  public async getCommentsToCache(postId: string, value: string): Promise<ICommentDocument[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      const responseFromCache: string[] = await this.client.LRANGE(`comments:${postId}`, 0, -1);
      const comments: ICommentDocument[] = [];

      for (const item of responseFromCache) {
        comments.push(Helpers.parseJson(item));
      }

      return comments;
    } catch (err) {
      log.error(err);
      throw new ServerError('Server error. Try again.');
    }
  }
}
