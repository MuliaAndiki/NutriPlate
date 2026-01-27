import { AppContext } from '@/contex/appContex';
import iotService from '@/service/iot.service';
import { JwtPayload } from '@/types/auth.types';

class IotController {
  public async RebootIot(c: AppContext) {
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

      const respone = await iotService.RebootIot();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'serve internal error',
          },
          400,
        );
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
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
  public async getStatus(c: AppContext) {
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

      const response = await iotService.getStatusIot();

      return c.json?.(
        {
          status: 200,
          message: 'ok',
          data: response ?? null,
        },
        200,
      );
    } catch (error) {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }
  public async startScale(c: AppContext) {
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
      const respone = await iotService.StartScale();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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
  public async tareMode(c: AppContext) {
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
      const respone = await iotService.TareModeScale();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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
  public async HoldWeight(c: AppContext) {
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
      const respone = await iotService.HoldWeight();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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
  public async getWeight(c: AppContext) {
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
      const respone = await iotService.GetWeight();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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
  public async cancelStart(c: AppContext) {
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
      const respone = await iotService.CancelStart();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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
  public async rejectWeight(c: AppContext) {
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
      const respone = await iotService.RejectWeight();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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
  public async confirmWeight(c: AppContext) {
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
      const respone = await iotService.ConfirmWeight();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfuly rebot scale',
          data: respone,
        },
        200,
      );
    } catch (error) {
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

export default new IotController();
