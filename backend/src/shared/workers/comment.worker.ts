import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { commentService } from '@service/db/comment.service';

const log: Logger = config.createLogger('commentWorker');

class CommentWorker {
  async addCommentToDB(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { data } = job;

      await commentService.addCommentToDB(data);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const commentWorker: CommentWorker = new CommentWorker();
