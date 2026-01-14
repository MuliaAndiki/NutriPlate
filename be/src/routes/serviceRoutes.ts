import { AppContext } from '@/contex/appContex';
import ServiceController from '@/controllers/ServiceController';
import Elysia from 'elysia';
class ServiceRoutes {
  public serviceRoutes;
  constructor() {
    this.serviceRoutes = new Elysia({ prefix: '/service' }).derive(() => ({
      json(data: any, status = 200) {
        return new Response(JSON.stringify(data), {
          status,
          headers: { 'Content-Type': 'application/json' },
        });
      },
    }));
    this.routes();
  }
  private routes() {
    this.serviceRoutes.get('/', (c: AppContext) => ServiceController.getFastApi(c));
    this.serviceRoutes.get('/health', (c: AppContext) => ServiceController.getHealth(c));
    this.serviceRoutes.get('/status', (c: AppContext) => ServiceController.getStatusIot(c));
  }
}

export default new ServiceRoutes().serviceRoutes;
