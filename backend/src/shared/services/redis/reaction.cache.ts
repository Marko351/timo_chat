import Logger from 'bunyan';
import { BaseCache } from '@service/redis/base.cache';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { IReactionDocument, IReactions } from '@reaction/interfaces/reaction.interface';

const log: Logger = config.createLogger('reactionsCache');

export class ReactionCache extends BaseCache {
  constructor() {
    super('reactionsCache');
  }

  public async savePostReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReactions: IReactions,
    type: string,
    previousReaction: string
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      }

      if (previousReaction) {
        // call remove reaction method
      }

      if (type) {
        await this.client.LPUSH(`reactions:${key}`, JSON.stringify(reaction));
        const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
        await this.client.HSET(`post:${key}`, dataToSave);
      }
    } catch (err) {
      log.error(err);
      throw new ServerError('Server error. Try again.');
    }
  }
}
