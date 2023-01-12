import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { mailTransport } from '@service/emails/mail.transport';

const log: Logger = config.createLogger('emailWorker');

class EmailWorker {
  async addNotificationEmail(job: Job, doneCallback: DoneCallback): Promise<void> {
    try {
      const { template, receiverEmail, subject } = job.data;

      await mailTransport.sendEmail(receiverEmail, subject, template);

      job.progress(100);
      doneCallback(null, job.data);
    } catch (err) {
      log.error(err);
      doneCallback(err as Error);
    }
  }
}

export const emailWorker: EmailWorker = new EmailWorker();
