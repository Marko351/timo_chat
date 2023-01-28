import fs from 'fs';
import ejs from 'ejs';
import { INotificationTemplate } from '@notifications/interfaces/notification.interface';

class NotificationTemplate {
  public notificationMessageTemplate(templateParams: INotificationTemplate): string {
    const { username, header, message } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/notification.ejs', 'utf-8'), {
      username,
      header,
      message,
      image_url: 'https://images.all-free-download.com/images/graphicwebp/combination_lock_312678.webp'
    });
  }
}

export const notificationTemplate: NotificationTemplate = new NotificationTemplate();
