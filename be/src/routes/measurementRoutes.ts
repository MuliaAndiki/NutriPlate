import Elysia from 'elysia';
import MeasurementController from '@/controllers/MeasurementController';
import { AppContext } from '@/contex/appContex';
import { verifyToken, requireRole } from '@/middlewares/auth';

class MeasurementRoutes {
  public measurementRoutes;

  constructor() {
    this.measurementRoutes = new Elysia({ prefix: '/measurement' }).derive(() => ({
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
    this.measurementRoutes.post(
      '/create',
      (c: AppContext) => MeasurementController.createMeasurement(c),
      {
        beforeHandle: [verifyToken().beforeHandle, requireRole(['POSYANDU']).beforeHandle],
      },
    );

    this.measurementRoutes.get(
      '/evaluation/:childId',
      (c: AppContext) => MeasurementController.getGrowthChart(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.measurementRoutes.get(
      '/:childId',
      (c: AppContext) => MeasurementController.getMeasurement(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
    this.measurementRoutes.put(
      '/:measurementId',
      (c: AppContext) => MeasurementController.updateMeasurement(c),
      {
        beforeHandle: [verifyToken().beforeHandle],
      },
    );
  }
}

export default new MeasurementRoutes().measurementRoutes;
