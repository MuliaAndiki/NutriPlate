import { AppContext } from '@/contex/appContex';
import IotController from '@/controllers/IotController';
import { verifyToken } from '@/middlewares/auth';
import Elysia from 'elysia';

class IotRoutes {
  public iotRoutes;
  constructor() {
    this.iotRoutes = new Elysia({ prefix: '/iot' }).derive(() => ({
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
    this.iotRoutes.post('/reboot', (c: AppContext) => IotController.RebootIot(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
  }
}

export default new IotRoutes().iotRoutes;
