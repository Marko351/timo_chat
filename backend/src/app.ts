import express, { Express } from 'express';

import { TimoServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: TimoServer = new TimoServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.initialize();
