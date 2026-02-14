import { AppContext } from '@/contex/appContex';
import modelService from '@/service/model.service';
import { JwtPayload } from '@/types/auth.types';
import { IMlModels } from '@/types/mlModel.types';
import { Prisma } from '@prisma/client';
import prisma from 'prisma/client';

class ModelsController {
  public async PostModelsVersion(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const modelsCurrent: IMlModels = await modelService.PostNewModels();
      if (!modelsCurrent) {
        return c.json?.(
          {
            status: 400,
            message: 'proxy error',
          },
          400,
        );
      }

      const saveModels = await prisma.mlModel.create({
        data: {
          name: modelsCurrent.name,
          modelPath: modelsCurrent.modelPath,
          version: modelsCurrent.version,
          metrics: modelsCurrent.metrics as Prisma.JsonObject,
          isActive: modelsCurrent.isActive,
        },
      });

      if (!saveModels) {
        return c.json?.(
          {
            status: 400,
            message: 'Proxy Error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'Succfully save informasion models ',
          data: saveModels,
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
  public async getModels(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      const models = await prisma.mlModel.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!models) {
        const model = await modelService.getCurrentModels();
        if (model) {
          return c.json?.(
            {
              status: 203,
              message: 'succec get model by fast Api',
            },
            203,
          );
        }
      }
      return c.json?.(
        {
          status: 200,
          message: 'succufuly get models lastest',
          data: models,
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
}

export default new ModelsController();
