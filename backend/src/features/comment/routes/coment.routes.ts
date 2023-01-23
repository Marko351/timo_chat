import { AddComment } from '@comment/controllers/add-comment.controller';
import { GetComment } from '@comment/controllers/get-comment.controller';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Router } from 'express';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/post/comments/:postId', authMiddleware.checkAuthentication, GetComment.prototype.comments);
    this.router.get('/post/comments/names/:postId/', authMiddleware.checkAuthentication, GetComment.prototype.commentNames);
    this.router.get('/post/single/comment/:postId/:commentId', authMiddleware.checkAuthentication, GetComment.prototype.singleComment);

    this.router.post('/post/comment', authMiddleware.checkAuthentication, AddComment.prototype.post);

    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
