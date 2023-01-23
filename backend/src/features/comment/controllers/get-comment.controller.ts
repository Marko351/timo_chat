import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { ObjectId } from 'mongodb';
import { commentQueue } from '@service/queues/comment.queue';
import { addCommentSchema } from '@comment/schemes/comments.schemes';
import { ICommentDocument, ICommentJob, ICommentNameList } from '@comment/interfaces/comment.interface';
import { CommentCache } from '@service/redis/comment.cache';
import { commentService } from '@service/db/comment.service';
import mongoose from 'mongoose';

const commentCache: CommentCache = new CommentCache();

export class GetComment {
  public async comments(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;

    let comments: ICommentDocument[] = await commentCache.getCommentsFromCache(postId);
    if (!comments.length) {
      comments = await commentService.getPostComments({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Post comments', comments });
  }

  public async commentNames(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;

    let commentNames: ICommentNameList[] = await commentCache.getCommentNamesFromCache(postId);
    if (!commentNames.length) {
      commentNames = await commentService.getPostCommentNames({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Post comments', comments: commentNames });
  }

  public async singleComment(req: Request, res: Response): Promise<void> {
    const { postId, commentId } = req.params;

    let comment: ICommentDocument[] = await commentCache.getSingleCommentFromCache(postId, commentId);
    if (!comment.length) {
      comment = await commentService.getPostComments({ _id: new mongoose.Types.ObjectId(commentId) }, { createdAt: -1 });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Post comments', comments: comment[0] });
  }
}
