import prisma from 'prisma/client';
import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import whoGrowthCalculationService from '@/service/whoGrowth.service';
import { cacheKeys } from '@/cache/cacheKey';
import { getRedis } from '@/utils/redis';
import { PickCreateMeasurements, PickMeasurementsChildID } from '@/types/measurement.types';

class MeasurementController {
  private get redis() {
    return getRedis();
  }
  public async createMeasurement(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const body = c.body as PickCreateMeasurements;
      const params = c.params as PickMeasurementsChildID;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!params?.childID) {
        return c.json?.({ status: 400, message: 'childID param is required' }, 400);
      }

      if (!body.measurementDate || !body.heightCm || !body.weightKg) {
        return c.json?.(
          { status: 400, message: 'measurementDate, heightCm, weightKg required' },
          400,
        );
      }
      const child = await prisma.child.findUnique({
        where: { id: params.childID },
        select: {
          id: true,
          parentId: true,
          posyanduId: true,
          gender: true,
          dateOfBirth: true,
        },
      });

      if (!child) {
        return c.json?.({ status: 404, message: 'Child not found' }, 404);
      }

      const measurementDateObj = new Date(body.measurementDate);

      const ageMonths = Math.max(
        0,
        Math.floor(
          (measurementDateObj.getTime() - child.dateOfBirth.getTime()) /
            (1000 * 60 * 60 * 24 * 30.4375),
        ),
      );
      const whoData = await prisma.whoHeightForAge.findMany({
        where: { gender: child.gender },
        orderBy: { ageMonths: 'asc' },
      });

      if (whoData.length === 0) {
        return c.json?.({ status: 500, message: 'WHO reference data not available' }, 500);
      }

      const who = whoData.reduce((prev, curr) =>
        Math.abs(curr.ageMonths - ageMonths) < Math.abs(prev.ageMonths - ageMonths) ? curr : prev,
      );

      const zScore = whoGrowthCalculationService.calculateZScore(Number(body.heightCm), {
        median: who.median,
        sdMinus3: who.sdMinus3,
        sdMinus2: who.sdMinus2,
        sdMinus1: who.sdMinus1,
        sdPlus1: who.sdPlus1,
        sdPlus2: who.sdPlus2,
        sdPlus3: who.sdPlus3,
      });
      const classification = whoGrowthCalculationService.classifyGrowthStatus(
        zScore.zScore,
        who.median,
        Number(body.heightCm),
      );

      const recommendation = whoGrowthCalculationService.generateRecommendation(
        classification,
        ageMonths,
      );

      const nutritionStatus = (() => {
        if (zScore.zScore < -3) return 'severely_underweight';
        if (zScore.zScore < -2) return 'underweight';
        if (zScore.zScore <= 2) return 'normal';
        return 'overweight';
      })();

      const measurement = await prisma.measurement.create({
        data: {
          childId: child.id,
          measurementDate: measurementDateObj,
          heightCm: Number(body.heightCm),
          weightKg: Number(body.weightKg),
          nutritionStatus,
          note: body.note,
        },
      });

      const evaluation = await prisma.whoEvaluation.create({
        data: {
          childId: child.id,
          measurementId: measurement.id,
          ageMonths,
          heightCm: measurement.heightCm,
          weightKg: measurement.weightKg,
          zScore: zScore.zScore,
          classification: JSON.parse(JSON.stringify(classification)),
          recommendation: JSON.parse(JSON.stringify(recommendation)),
        },
      });

      return c.json?.(
        {
          status: 201,
          message: 'Measurement created & automatically evaluated',
          data: {
            measurement,
            evaluation,
          },
        },
        201,
      );
    } catch (error) {
      console.error('createMeasurement error:', error);
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }

  public async getGrowthChart(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const { childId } = c.params as { childId?: string };

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!childId) {
        return c.json?.({ status: 400, message: 'childId required' }, 400);
      }

      const child = await prisma.child.findUnique({
        where: { id: childId },
        select: {
          id: true,
          gender: true,
          dateOfBirth: true,
          parentId: true,
          posyanduId: true,
        },
      });

      if (!child) {
        return c.json?.({ status: 404, message: 'Child not found' }, 404);
      }

      const hasAccess = child.parentId === jwtUser.id || child.posyanduId === jwtUser.id;

      if (!hasAccess) {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      const measurements = await prisma.measurement.findMany({
        where: { childId },
        orderBy: { measurementDate: 'asc' },
      });

      if (measurements.length === 0) {
        return c.json?.(
          {
            status: 200,
            data: {
              summary: null,
              weightChart: { unit: { x: 'years', y: 'kg' }, lines: { child: [], whoMedian: [] } },
              heightChart: { unit: { x: 'years', y: 'cm' }, lines: { child: [], whoMedian: [] } },
            },
          },
          200,
        );
      }

      const toAgeYears = (d: Date) =>
        Number(
          (
            (d.getTime() - child.dateOfBirth.getTime()) /
            (1000 * 60 * 60 * 24 * 30.4375 * 12)
          ).toFixed(1),
        );

      const whoHeight = await prisma.whoHeightForAge.findMany({
        where: { gender: child.gender },
        orderBy: { ageMonths: 'asc' },
      });

      const findNearestWho = (ageMonths: number) =>
        whoHeight.reduce((prev, curr) =>
          Math.abs(curr.ageMonths - ageMonths) < Math.abs(prev.ageMonths - ageMonths) ? curr : prev,
        );

      const heightChildLine: any[] = [];
      const heightWhoLine: any[] = [];
      const weightChildLine: any[] = [];

      measurements.forEach((m) => {
        const ageMonths = Math.max(
          0,
          Math.floor(
            (m.measurementDate.getTime() - child.dateOfBirth.getTime()) /
              (1000 * 60 * 60 * 24 * 30.4375),
          ),
        );

        const ageYears = Number((ageMonths / 12).toFixed(1));
        const who = findNearestWho(ageMonths);

        heightChildLine.push({
          age: ageYears,
          value: Number(m.heightCm),
        });

        heightWhoLine.push({
          age: ageYears,
          value: who.median,
        });

        weightChildLine.push({
          age: ageYears,
          value: Number(m.weightKg),
        });
      });

      const last = measurements[measurements.length - 1];

      const response = {
        summary: {
          lastWeightKg: Number(last.weightKg),
          lastHeightCm: Number(last.heightCm),
          lastAgeYears: toAgeYears(last.measurementDate),
        },
        weightChart: {
          unit: { x: 'years', y: 'kg' },
          lines: {
            child: weightChildLine,
          },
        },
        heightChart: {
          unit: { x: 'years', y: 'cm' },
          lines: {
            child: heightChildLine,
            whoMedian: heightWhoLine,
          },
        },
      };

      return c.json?.(
        {
          status: 200,
          data: response,
        },
        200,
      );
    } catch (error) {
      console.error('getGrowthChart error:', error);
      return c.json?.({ status: 500, message: 'Server internal error' }, 500);
    }
  }

  public async getMeasurement(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const { childId } = c.params as { childId?: string };

      if (!jwtUser) {
        return c.json?.(
          {
            message: 'Unauthorized',
            status: 401,
          },
          401,
        );
      }

      if (!childId) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const cacheKey = cacheKeys.measurement.byChild(childId);

      try {
        const cacheMeasurementChild = await this.redis.get(cacheKey);
        if (cacheMeasurementChild) {
          return c.json?.(
            {
              status: 200,
              message: 'succesfully get by MeasureChild',
              data: JSON.parse(cacheMeasurementChild),
            },
            200,
          );
        }
      } catch (error) {
        console.warn(`redis error, fallback DM ${error}`);
      }
      const measurement = await prisma.measurement.findMany({
        where: { childId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
      if (!measurement) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        await this.redis.set(cacheKey, JSON.stringify(measurement), { EX: 60 });
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfully get MeasureChild',
          data: measurement,
        },
        200,
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
  public async updateMeasurement(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const { measurementId } = c.params as { measurementId?: string };
      const body = c.body as any;

      if (!jwtUser) {
        return c.json?.({ status: 401, message: 'Unauthorized' }, 401);
      }

      if (!measurementId) {
        return c.json?.({ status: 400, message: 'measurementId required' }, 400);
      }

      const { measurementDate, heightCm, weightKg } = body;

      if (!measurementDate || !heightCm || !weightKg) {
        return c.json?.(
          { status: 400, message: 'measurementDate, heightCm, weightKg required' },
          400,
        );
      }

      const measurement = await prisma.measurement.findUnique({
        where: { id: measurementId },
        include: {
          child: {
            select: {
              id: true,
              parentId: true,
              posyanduId: true,
              gender: true,
              dateOfBirth: true,
            },
          },
        },
      });

      if (!measurement) {
        return c.json?.({ status: 404, message: 'Measurement not found' }, 404);
      }

      const child = measurement.child;

      const hasAccess = child.parentId === jwtUser.id || child.posyanduId === jwtUser.id;

      if (!hasAccess) {
        return c.json?.({ status: 403, message: 'Forbidden' }, 403);
      }

      const updatedMeasurement = await prisma.measurement.update({
        where: { id: measurementId },
        data: {
          measurementDate: new Date(measurementDate),
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
        },
      });

      const ageMonths = Math.max(
        0,
        Math.floor(
          (updatedMeasurement.measurementDate.getTime() - child.dateOfBirth.getTime()) /
            (1000 * 60 * 60 * 24 * 30.4375),
        ),
      );

      const whoData = await prisma.whoHeightForAge.findMany({
        where: { gender: child.gender },
        orderBy: { ageMonths: 'asc' },
      });

      if (whoData.length === 0) {
        return c.json?.({ status: 500, message: 'WHO reference data not available' }, 500);
      }

      const who = whoData.reduce((prev, curr) =>
        Math.abs(curr.ageMonths - ageMonths) < Math.abs(prev.ageMonths - ageMonths) ? curr : prev,
      );

      const zScore = whoGrowthCalculationService.calculateZScore(
        Number(updatedMeasurement.heightCm),
        {
          median: who.median,
          sdMinus3: who.sdMinus3,
          sdMinus2: who.sdMinus2,
          sdMinus1: who.sdMinus1,
          sdPlus1: who.sdPlus1,
          sdPlus2: who.sdPlus2,
          sdPlus3: who.sdPlus3,
        },
      );

      const classification = whoGrowthCalculationService.classifyGrowthStatus(
        zScore.zScore,
        who.median,
        Number(updatedMeasurement.heightCm),
      );

      const recommendation = whoGrowthCalculationService.generateRecommendation(
        classification,
        ageMonths,
      );

      const evaluation = await prisma.whoEvaluation.update({
        where: { measurementId },
        data: {
          ageMonths,
          heightCm: updatedMeasurement.heightCm,
          weightKg: updatedMeasurement.weightKg,
          zScore: zScore.zScore,
          classification: JSON.parse(JSON.stringify(classification)),
          recommendation: JSON.parse(JSON.stringify(recommendation)),
        },
      });

      await Promise.allSettled([
        this.redis.del(cacheKeys.measurement.byChild(child.id)),
        this.redis.del(cacheKeys.evaluation.byChild(child.id)),
      ]);

      return c.json?.(
        {
          status: 200,
          message: 'Measurement updated & re-evaluated',
          data: {
            measurement: updatedMeasurement,
            evaluation,
          },
        },
        200,
      );
    } catch (error) {
      console.error('updateMeasurement error:', error);
      return c.json?.(
        {
          status: 500,
          message: 'Server internal error',
          error: error instanceof Error ? error.message : error,
        },
        500,
      );
    }
  }
}

export default new MeasurementController();
