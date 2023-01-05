import express, { Express } from 'express';

import { TimoServer } from './setupServer';
import databaseConnection from './setupDatabase';

class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();
    const server: TimoServer = new TimoServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
