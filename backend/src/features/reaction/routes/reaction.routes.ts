import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddReactions } from '@reaction/controllers/add-reactions.controller';
import { RemoveReactions } from '@reaction/controllers/remove-reactions.controller';
import { Router } from 'express';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.post('/post/reaction', authMiddleware.checkAuthentication, AddReactions.prototype.reaction);

    this.router.delete(
      '/post/reaction/:postId/:previousReaction/:postReactions',
      authMiddleware.checkAuthentication,
      RemoveReactions.prototype.reaction
    );

    return this.router;
  }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
