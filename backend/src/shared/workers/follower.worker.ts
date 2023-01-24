import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { mailTransport } from '@service/emails/mail.transport';
import { followerService } from '@service/db/follower.service';

const log: Logger = config.createLogger('followerWorker');

class FollowerWorker {
  async addFollowerToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo, username, followerDocumentId } = job.data;

      await followerService.addFollowerToDB(keyOne, keyTwo, username, followerDocumentId);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }

  async removeFollowerFromDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { keyOne, keyTwo } = job.data;

      await followerService.removeFollowerFromDB(keyOne, keyTwo);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const followerWorker: FollowerWorker = new FollowerWorker();
