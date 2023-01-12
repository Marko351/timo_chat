import fs from 'fs';
import ejs from 'ejs';

class ForgotPasswordTemplate {
  public passwordResetTemplate(username: string, resetLink: string): string {
    return ejs.render(fs.readFileSync(__dirname + '/forgot-password.template.ejs', 'utf-8'), {
      username,
      resetLink,
      image_url: 'https://images.all-free-download.com/images/graphicwebp/combination_lock_312678.webp'
    });
  }
}

export const forgotPasswordTemplate: ForgotPasswordTemplate = new ForgotPasswordTemplate();
