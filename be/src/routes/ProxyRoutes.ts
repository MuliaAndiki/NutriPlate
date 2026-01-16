import { AppContext } from '@/contex/appContex';
import ProxyController from '@/controllers/ProxyController';
import Elysia from 'elysia';
class ProxyRoutes {
  public proxyRoutes;
  constructor() {
    this.proxyRoutes = new Elysia({ prefix: '/service' }).derive(() => ({
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
    this.proxyRoutes.get('/', (c: AppContext) => ProxyController.getFastApi(c));
    this.proxyRoutes.get('/health', (c: AppContext) => ProxyController.getHealth(c));
    this.proxyRoutes.get('/status', (c: AppContext) => ProxyController.getStatusIot(c));
  }
}

export default new ProxyRoutes().proxyRoutes;
