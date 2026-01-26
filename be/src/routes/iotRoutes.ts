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
    this.iotRoutes.get('/status', (c: AppContext) => IotController.getStatus(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/start-weighing', (c: AppContext) => IotController.startScale(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/tare', (c: AppContext) => IotController.tareMode(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/hold-weight', (c: AppContext) => IotController.HoldWeight(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.get('/weight', (c: AppContext) => IotController.getWeight(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/cancel-weighing', (c: AppContext) => IotController.cancelStart(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/reject-weight', (c: AppContext) => IotController.rejectWeight(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/confirm-weight', (c: AppContext) => IotController.confirmWeight(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
  }
}

export default new IotRoutes().iotRoutes;
