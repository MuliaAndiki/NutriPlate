import { AppContext } from '@/contex/appContex';
import IotController from '@/controllers/IotController';
import { requireRole, verifyToken } from '@/middlewares/auth';
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
    this.iotRoutes.post('/status', (c: AppContext) => IotController.receiveStatus(c));
    this.iotRoutes.post('/command-executed', (c: AppContext) => IotController.commandExecuted(c));

    this.iotRoutes.post('/command/send', (c: AppContext) => IotController.sendCommand(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.get('/devices', (c: AppContext) => IotController.getDevices(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.get('/device/:token', (c: AppContext) => IotController.getDeviceDetail(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.get('/device/:token/foods', (c: AppContext) => IotController.getDeviceFoods(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.post('/register', (c: AppContext) => IotController.registerDevice(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.put('/device/:token', (c: AppContext) => IotController.updateDevice(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.delete('/device/:token', (c: AppContext) => IotController.deleteDevice(c), {
      beforeHandle: [verifyToken().beforeHandle],
    });
    this.iotRoutes.get('/device/all', (c: AppContext) => IotController.allDevice(c), {
      beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU', 'ADMIN']).beforeHandle],
    });
  }
}

export default new IotRoutes().iotRoutes;
