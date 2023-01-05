import express, { Express } from 'express';

import { TimoServer } from './setupServer';

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: TimoServer = new TimoServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
