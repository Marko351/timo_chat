import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { FollowerCache } from '@service/redis/follower.cache';
import { followerQueue } from '@service/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
  public async follower(req: Request, res: Response): Promise<void> {
    const { followerId, followeeId } = req.params;

    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`following:${req.currentUser!.userId}`, followeeId);
    const removeFolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followeeId}`, followerId);

    const followersCount: Promise<void> = followerCache.updateFollowersCount(followeeId, 'followersCount', -1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCount(followerId, 'followingCount', -1);

    await Promise.all([removeFollowerFromCache, removeFolloweeFromCache, followersCount, followeeCount]);

    followerQueue.addFollowerJob('removeFollowerFromDB', {
      keyOne: followeeId,
      keyTwo: followerId
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Unfollowed user' });
  }
}
