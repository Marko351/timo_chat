import { Password } from '@auth/controllers/password.controller';
import { SignIn } from '@auth/controllers/signin.controller';
import { SignOut } from '@auth/controllers/signout.controller';
import { SignUp } from '@auth/controllers/signup.controller';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignUp.create);
    this.router.post('/signin', SignIn.read);
    this.router.post('/forgot-password', Password.create);
    this.router.post('/reset-password/:token', Password.update);

    return this.router;
  }

  public signoutRoute(): Router {
    this.router.get('/signout', SignOut.signout);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
