import { AppContext } from '@/contex/appContex';
import ProxyService from '@/service/Proxy.service';
class ProxyController {
  public async getFastApi(c: AppContext) {
    try {
      const response = await ProxyService.getFastApi();
      if (!response) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      }
      return c.json?.({
        status: 200,
        message: 'success',
        data: response,
      });
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
  public async getHealth(c: AppContext) {
    try {
      const respone = await ProxyService.getHealth();
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
          message: 'success',
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
  public async getStatusIot(c: AppContext) {
    try {
      const respone = await ProxyService.getStatusIot();
      if (!respone) {
        return c.json?.(
          {
            status: 400,
            message: 'server error',
          },
          400,
        );
      }
      return c.json?.(
        {
          status: 200,
          message: 'success',
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

export default new ProxyController();
