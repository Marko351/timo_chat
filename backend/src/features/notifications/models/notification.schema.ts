import { INotificationDocument, INotification } from '@notifications/interfaces/notification.interface';
import { notificationService } from '@service/db/notification.service';
import mongoose, { model, Model, Schema } from 'mongoose';

const notificationSchema: Schema = new Schema({
  userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  read: { type: Boolean, default: false },
  message: { type: String, default: '' },
  notificationType: String,
  entityId: mongoose.Types.ObjectId,
  comment: { type: String, default: '' },
  reaction: { type: String, default: '' },
  post: { type: String, default: '' },
  imgId: { type: String, default: '' },
  imgVersion: { type: String, default: '' },
  gifUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now() }
});

notificationSchema.methods.insertNotification = async (body: INotification) => {
  await NotificationModel.create(body);

  try {
    const notifications: INotificationDocument[] = await notificationService.getNotifications(body.userTo);
    return notifications;
  } catch (err) {
    return err;
  }
};

const NotificationModel: Model<INotificationDocument> = model<INotificationDocument>('Notification', notificationSchema, 'Notification');
export { NotificationModel };
