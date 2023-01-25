import { Add } from '@followers/controllers/follow-user.controller';
import { Get } from '@followers/controllers/get-followers.controller';
import { Remove } from '@followers/controllers/unfollow-user.controller';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Router } from 'express';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, Remove.prototype.follower);

    this.router.get('/user/following', authMiddleware.checkAuthentication, Get.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, Get.prototype.userFollowers);

    return this.router;
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
