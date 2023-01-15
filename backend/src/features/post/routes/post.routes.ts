import { authMiddleware } from '@global/helpers/auth-middleware';
import { CreatePost } from '@post/controllers/create-post.controller';
import { Router } from 'express';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
