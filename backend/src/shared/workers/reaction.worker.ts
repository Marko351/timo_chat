import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { reactionService } from '@service/db/reaction.service';

const log: Logger = config.createLogger('reactionWorker');

class ReactionWorker {
  async addReactionToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { data } = job;

      await reactionService.addReactionDataToDB(data);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }

  async removeReactionToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { data } = job;

      await reactionService.removeReactionDataFromDB(data);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const reactionWorker: ReactionWorker = new ReactionWorker();
