import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { ObjectId } from 'mongodb';
import { commentQueue } from '@service/queues/comment.queue';
import { addCommentSchema } from '@comment/schemes/comments.schemes';
import { ICommentDocument, ICommentJob } from '@comment/interfaces/comment.interface';
import { CommentCache } from '@service/redis/comment.cache';

const commentCache: CommentCache = new CommentCache();

export class AddComment {
  @joiValidation(addCommentSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { userTo, postId, profilePicture, comment } = req.body;

    const commentObjectId: ObjectId = new ObjectId();
    const commentData: ICommentDocument = {
      _id: commentObjectId,
      postId,
      username: req.currentUser!.username,
      avatarColor: req.currentUser!.avatarColor,
      profilePicture,
      comment,
      createdAt: new Date()
    } as ICommentDocument;

    await commentCache.savePostCommentToCache(postId, JSON.stringify(commentData));

    const databaseComment: ICommentJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      comment: commentData
    };

    commentQueue.addCommentJob('addCommentToDB', databaseComment);

    res.status(HTTP_STATUS.OK).json({ message: 'Comment created successfully' });
  }
}
