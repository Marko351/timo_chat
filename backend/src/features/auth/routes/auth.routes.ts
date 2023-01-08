import { SignUp } from '@auth/controllers/signup.controller';
import { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/signup', SignUp.create);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
