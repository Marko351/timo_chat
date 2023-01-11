import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { userService } from '@service/db/user.service';

const log: Logger = config.createLogger('userWorker');

class UserWorker {
  async addUserToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      await userService.createUser(value);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
