import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { commentService } from '@service/db/comment.service';
import { blockUserService } from '@service/db/blockUser.service';

const log: Logger = config.createLogger('blockedUserWorker');

class BlockedUserWorker {
  async addBlockedUserToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo, type } = job.data;

      if (type === 'block') {
        await blockUserService.blockUser(keyOne, keyTwo);
      } else {
        await blockUserService.unblockUser(keyOne, keyTwo);
      }

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const blockedUserWorker: BlockedUserWorker = new BlockedUserWorker();
