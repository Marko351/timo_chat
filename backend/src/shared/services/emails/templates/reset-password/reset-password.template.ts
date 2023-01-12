import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmationTemplate(templateParams: IResetPasswordParams): string {
    const { date, email, ipaddress, username } = templateParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password.template.ejs', 'utf-8'), {
      email,
      date,
      ipaddress,
      username,
      image_url: 'https://images.all-free-download.com/images/graphicwebp/combination_lock_312678.webp'
    });
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
