import { Helpers } from './../../globals/helpers/helpers';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.firstLetterUpercase(username) }, { email: email.toLowerCase() }]
    };

    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;

    return user;
  }

  public async getUserByUsername(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username: Helpers.firstLetterUpercase(username) }).exec()) as IAuthDocument;

    return user;
  }

  public async createAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }
}

export const authService: AuthService = new AuthService();
