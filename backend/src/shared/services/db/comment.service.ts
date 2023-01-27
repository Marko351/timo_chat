import { NotificationModel } from '@notifications/models/notification.schema';
import { UserCache } from './../redis/user.cache';
import { ICommentDocument, ICommentJob, ICommentNameList, IQueryComment } from '@comment/interfaces/comment.interface';
import { CommentsModel } from '@comment/models/comment.schema';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import mongoose, { Aggregate, Query } from 'mongoose';
import { IUserDocument } from '@user/interfaces/user.interface';
import { INotificationDocument } from '@notifications/interfaces/notification.interface';
import { socketIONotificationObject } from '@socket/notification.socket';

const userCache: UserCache = new UserCache();

class CommentService {
  public async addCommentToDB(commentData: ICommentJob): Promise<void> {
    const { postId, userTo, userFrom, comment, username } = commentData;

    const commentDB: Promise<ICommentDocument> = CommentsModel.create(comment);

    const post: Query<IPostDocument, IPostDocument> = PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { commentsCount: 1 } },
      { new: true }
    ) as Query<IPostDocument, IPostDocument>;

    const user: Promise<IUserDocument> = userCache.getUserFromCache(userTo) as Promise<IUserDocument>;

    const response: [ICommentDocument, IPostDocument, IUserDocument] = await Promise.all([commentDB, post, user]);

    //send comment notification
    if (response[2].notifications.comments && userFrom !== userTo) {
      const notificationModel: INotificationDocument = new NotificationModel();
      const notifications = await notificationModel.insertNotification({
        userFrom,
        userTo,
        message: `${username} commented on your post.`,
        notificationType: 'comment',
        entityId: new mongoose.Types.ObjectId(postId),
        createdItemId: new mongoose.Types.ObjectId(response[0]._id),
        createdAt: new Date(),
        comment: comment.comment,
        post: response[1].post,
        imgId: response[1].imgId!,
        imgVersion: response[1].imgVersion!,
        gifUrl: response[1].gifUrl!,
        reaction: ''
      });
      // send to client
      socketIONotificationObject.emit('insert notification', notifications, { userTo });

      // send to email queue
    }
  }

  public async getPostComments(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentDocument[]> {
    const comments: Aggregate<ICommentDocument[]> = CommentsModel.aggregate<ICommentDocument>([{ $match: query }, { $sort: sort }]);

    return comments;
  }

  public async getPostCommentNames(query: IQueryComment, sort: Record<string, 1 | -1>): Promise<ICommentNameList[]> {
    const commentsNamesList: Aggregate<ICommentNameList[]> = CommentsModel.aggregate<ICommentNameList>([
      { $match: query },
      { $sort: sort },
      { $group: { _id: null, names: { $addToSet: '$username' }, count: { $sum: 1 } } },
      { $project: { _id: 0 } } // exclude _id from result
    ]);

    return commentsNamesList;
  }
}

export const commentService: CommentService = new CommentService();
