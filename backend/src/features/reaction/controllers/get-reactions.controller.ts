import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionCache } from '@service/redis/reaction.cache';
import { reactionQueue } from '@service/queues/reaction.queue';
import { reactionService } from '@service/db/reaction.service';
import mongoose from 'mongoose';

const reactionCache: ReactionCache = new ReactionCache();

export class GetReactions {
  public async reaction(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;

    let reactions: [IReactionDocument[], number] | [] = await reactionCache.getReactionsFromCache(postId);

    if (!reactions.length) {
      reactions = await reactionService.getPostReactions({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Post reactions', reactions: reactions[0], count: reactions[1] });
  }

  public async singleReactionByUsername(req: Request, res: Response): Promise<void> {
    const { postId, username } = req.params;

    let reactions: [IReactionDocument, number] | [] = await reactionCache.getSingleReactionByUsernameFromCache(postId, username);

    if (!reactions.length) {
      reactions = await reactionService.getSinglePostReactionByUsername(postId, username);
    }

    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Single post reaction by username', reactions: reactions.length ? reactions[0] : {}, count: reactions.length ? 1 : 0 });
  }

  public async reactionsByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;

    const reactions: IReactionDocument[] = await reactionService.getReactionsByUsername(username);

    res.status(HTTP_STATUS.OK).json({ message: 'All reaction by username', reactions });
  }
}
