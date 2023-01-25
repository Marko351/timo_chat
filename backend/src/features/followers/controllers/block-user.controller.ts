import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { FollowerCache } from '@service/redis/follower.cache';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { IFollowerData } from '@followers/interfaces/followers.interfaces';
import mongoose from 'mongoose';
import { socketIOFollowerObject } from '@socket/follower.socket';
import { followerQueue } from '@service/queues/follower.queue';
import { blockQueue } from '@service/queues/block.queue';

const followerCache: FollowerCache = new FollowerCache();
const userCache: UserCache = new UserCache();

export class BlockUser {
  public async block(req: Request, res: Response): Promise<void> {
    const { followerId } = req.params;

    BlockUser.prototype.updateBlockedUser(followerId, req.currentUser!.userId, 'block');
    blockQueue.addBlockUserJob('addBlockedUserToDB', {
      keyOne: req.currentUser!.userId,
      keyTwo: followerId,
      type: 'block'
    });

    res.status(HTTP_STATUS.OK).json({ message: 'User Blocked' });
  }

  public async unblock(req: Request, res: Response): Promise<void> {
    const { followerId } = req.params;

    BlockUser.prototype.updateBlockedUser(followerId, req.currentUser!.userId, 'unblock');
    blockQueue.addBlockUserJob('removeBlockedUserToDB', {
      keyOne: req.currentUser!.userId,
      keyTwo: followerId,
      type: 'block'
    });

    res.status(HTTP_STATUS.OK).json({ message: 'User unblocked' });
  }

  private async updateBlockedUser(followerId: string, userId: string, type: 'block' | 'unblock'): Promise<void> {
    const blocked: Promise<void> = followerCache.updateBlockedUserProp(`${userId}`, 'blocked', `${followerId}`, type);
    const blockedBy: Promise<void> = followerCache.updateBlockedUserProp(`${followerId}`, 'blockedBy', `${userId}`, type);

    await Promise.all([blocked, blockedBy]);
  }
}
