import { CurrentUser } from '@auth/controllers/current-user.controller';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Router } from 'express';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/currentuser', authMiddleware.checkAuthentication, CurrentUser.read);

    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
