import Elysia from 'elysia';
import cors from '@elysiajs/cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import posyanduRoutes from './routes/posyanduRoutes';
import childRoutes from './routes/childRoutes';
import ProxyRoutes from './routes/ProxyRoutes';
import notificationRoutes from './routes/notificationRoutes';
import programRoutes from './routes/programRoutes';
import progresRoutes from './routes/progresRoutes';
import foodIntakeRoutes from './routes/foodIntakeRoutes';
import foodIntakeSummaryRoutes from './routes/foodIntakeSummaryRoutes';
import { swagger } from '@elysiajs/swagger';
import taskRoutes from './routes/taskRoutes';
import measurementRoutes from './routes/measurementRoutes';
import { nutriplateProgramCron, otpCleanupCron, sessionCleanupCron } from './job';
import { env } from './config/env.config';
import iotRoutes from './routes/iotRoutes';
import modelsRoutes from './routes/modelsRoutes';

class App {
  public app: Elysia;

  constructor() {
    this.app = new Elysia();
    this.middlewares();
    this.plugins();
    this.crons();
    this.routes();
  }
  private plugins() {
    this.app.use(
      swagger({
        path: '/api-docs',
        documentation: {
          info: {
            title: 'NutriPlate API',
            version: '1.0.0',
            description: 'API documentation untuk Frontend',
          },
          servers: [
            {
              url: 'http://localhost:5000',
            },
          ],
        },
      }),
    );
  }
  private routes(): void {
    this.app.get('/', () => 'Hello Elysia! Bun js');
  }
  private crons(): void {
    if (env.NODE_ENV !== 'test') {
      this.app.use(nutriplateProgramCron).use(otpCleanupCron).use(sessionCleanupCron);
    }
  }

  private middlewares() {
    this.app.use(cors({ origin: '*' }));
    this.app.group('/api', (api) =>
      api
        .use(authRoutes)
        .use(userRoutes)
        .use(posyanduRoutes)
        .use(childRoutes)
        .use(ProxyRoutes)
        .use(notificationRoutes)
        .use(programRoutes)
        .use(progresRoutes)
        .use(foodIntakeRoutes)
        .use(foodIntakeSummaryRoutes)
        .use(taskRoutes)
        .use(measurementRoutes)
        .use(iotRoutes)
        .use(modelsRoutes),
    );
  }
}

export default new App().app;
