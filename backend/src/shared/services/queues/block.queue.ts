import { IBlockedUserJobData } from '@followers/interfaces/followers.interfaces';
import { BaseQueue } from '@service/queues/base.queue';
import { blockedUserWorker } from '@worker/block.worker';

class BlockQueue extends BaseQueue {
  constructor() {
    super('block');
    this.processJob('addBlockedUserToDB', 5, blockedUserWorker.addBlockedUserToDB);
    this.processJob('removeBlockedUserToDB', 5, blockedUserWorker.addBlockedUserToDB);
  }

  public addBlockUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  }
}

export const blockQueue: BlockQueue = new BlockQueue();
