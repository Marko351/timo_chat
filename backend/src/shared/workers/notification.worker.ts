import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { notificationService } from '@service/db/notification.service';

const log: Logger = config.createLogger('emailWorker');

class NotificationWorker {
  async updateNotification(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { key } = job.data;

      await notificationService.updateNotification(key);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }

  async deleteNotification(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { key } = job.data;

      await notificationService.deleteNotification(key);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const notificationWorker: NotificationWorker = new NotificationWorker();
