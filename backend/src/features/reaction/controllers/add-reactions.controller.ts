import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { ObjectId } from 'mongodb';
import { socketIOPostObject } from '@socket/post.socket';
import { BadRequestError } from '@global/helpers/error-handler';
import { addReactionSchema } from '@reaction/schemes/reactions';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { ReactionCache } from '@service/redis/reaction.cache';

const reactionCache: ReactionCache = new ReactionCache();

export class AddReactions {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const { userTo, postId, type, previousReaction, postReactions, profilePicture } = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avataColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as IReactionDocument;

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReactions, type, previousReaction);

    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully' });
  }
}
