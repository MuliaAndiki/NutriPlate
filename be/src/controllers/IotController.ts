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
}

export default new IotController();
