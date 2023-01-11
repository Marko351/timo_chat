import { SignIn } from '@auth/controllers/signin.controller';
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

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
