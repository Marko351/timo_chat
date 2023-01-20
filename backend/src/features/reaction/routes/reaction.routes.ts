import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddReactions } from '@reaction/controllers/add-reactions.controller';
import { GetReactions } from '@reaction/controllers/get-reactions.controller';
import { RemoveReactions } from '@reaction/controllers/remove-reactions.controller';
import { Router } from 'express';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  }

  public routes(): Router {
    this.router.get('/post/reactions/:postId', authMiddleware.checkAuthentication, GetReactions.prototype.reaction);
    this.router.get(
      '/post/single/reaction/username/:postId/:username',
      authMiddleware.checkAuthentication,
      GetReactions.prototype.singleReactionByUsername
    );
    this.router.get('/post/reactions/username/:username', authMiddleware.checkAuthentication, GetReactions.prototype.reactionsByUsername);

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
