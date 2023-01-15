import { postWorker } from './../../workers/post.worker';
import { IPostJobData } from '@post/interfaces/post.interface';
import { BaseQueue } from '@service/queues/base.queue';

class PostQueue extends BaseQueue {
  constructor() {
    super('post');
    this.processJob('addPostToDB', 5, postWorker.savePostToDB);
  }

  public addPostJob(name: string, data: IPostJobData): void {
    this.addJob(name, data);
  }
}

export const postQueue: PostQueue = new PostQueue();
