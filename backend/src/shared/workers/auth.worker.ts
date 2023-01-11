import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';

const log: Logger = config.createLogger('authWorker');

class AuthWorker {
  async addAuthUserToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;

      await authService.createAuthUser(value);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const authWorker: AuthWorker = new AuthWorker();
