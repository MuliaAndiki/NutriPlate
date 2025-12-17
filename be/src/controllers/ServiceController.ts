import { AppContext } from '@/contex/appContex';
import fastApiService from '@/service/fastApi.service';

class ServiceController {
  public async getFastApi(c: AppContext) {
    try {
      const response = await fastApiService.getFastApi();
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
}

export default new ServiceController();
