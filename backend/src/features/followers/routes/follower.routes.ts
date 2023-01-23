import { Add } from '@followers/controllers/follow-user.controller';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Router } from 'express';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);

    return this.router;
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
