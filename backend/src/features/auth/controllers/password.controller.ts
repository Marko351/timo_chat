import HTTP_STATUS from 'http-status-codes';
import moment from 'moment';
import ip from 'ip';
import { Request, Response } from 'express';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { joiValidation } from '@global/decorators/joi-validation.decorator';
import { authService } from '@service/db/auth.service';
import { config } from '@root/config';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password.template';
import { emailQueue } from '@service/queues/email.queue';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password.template';

export class Password {
  @joiValidation(emailSchema)
  public static async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const existsingUser: IAuthDocument = await authService.getUserByEmail(email);
    if (!existsingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString('hex');

    await authService.updatePasswordToken(`${existsingUser._id}`, randomCharacters, Date.now() + 60 * 60 * 1000);

    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existsingUser.username, resetLink);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });

    res.status(HTTP_STATUS.OK).json({ message: 'Password reset email sent' });
  }

  @joiValidation(passwordSchema)
  public static async update(req: Request, res: Response): Promise<void> {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (password !== confirmPassword) {
      throw new BadRequestError('Passwords do not match!');
    }

    const existsingUser: IAuthDocument = await authService.getUserByPasswordToken(token);
    if (!existsingUser) {
      throw new BadRequestError('Reset token has expired');
    }

    existsingUser.password = password;
    existsingUser.passwordResetExpires = undefined;
    existsingUser.passwordResetToken = undefined;
    await existsingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existsingUser.username,
      email: existsingUser.email,
      ipaddress: ip.address(),
      date: moment().format('YYYY/MM/DD HH:mm')
    };

    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(templateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: existsingUser.email, subject: 'Password reset confirmation' });

    res.status(HTTP_STATUS.OK).json({ message: 'Password successfully updated' });
  }
}
