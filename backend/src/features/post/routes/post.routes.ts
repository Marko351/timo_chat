import { authMiddleware } from '@global/helpers/auth-middleware';
import { CreatePost } from '@post/controllers/create-post.controller';
import { DeletePost } from '@post/controllers/delete-post.controller';
import { GetPost } from '@post/controllers/get-posts.controller';
import { UpdatePost } from '@post/controllers/update-post.controller';
import { Router } from 'express';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/post/all/:page', authMiddleware.checkAuthentication, GetPost.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthentication, GetPost.prototype.postsWithImages);

    this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);
    this.router.post('/post/image/post', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);

    this.router.delete('/post/:postId', authMiddleware.checkAuthentication, DeletePost.prototype.post);

    this.router.put('/post/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.post);
    this.router.put('/post/image/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.postWithImage);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
