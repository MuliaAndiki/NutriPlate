import { AppContext } from '@/contex/appContex';
import iotService from '@/service/iot.service';
import type {
  IotCommandExecutedRequest,
  IotRegisterRequest,
  IotSendCommandRequest,
  IotStatusRequest,
  IotUpdateRequest,
} from '@/types/iot.types';
import { JwtPayload } from '@/types/auth.types';

class IotController {
  public async receiveStatus(c: AppContext) {
    try {
      const payload = c.body as IotStatusRequest;
      const response = await iotService.receiveStatus(payload);

      if (!response.success) {
        return c.json?.(response, 404);
      }

      return c.json?.(response, 200);
    } catch (error) {
      return c.json?.(
        {
          success: false,
          error: 'server internal error',
        },
        500,
      );
    }
  }

  public async commandExecuted(c: AppContext) {
    try {
      const payload = c.body as IotCommandExecutedRequest;
      const response = await iotService.commandExecuted(payload);

      if (!response.success) {
        return c.json?.(response, 404);
      }

      return c.json?.(response, 200);
    } catch {
      return c.json?.(
        {
          success: false,
          error: 'server internal error',
        },
        500,
      );
    }
  }

  public async sendCommand(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            success: false,
            message: 'Unauthorized',
          },
          401,
        );
      }

      const payload = c.body as IotSendCommandRequest;
      const response = await iotService.sendCommand(payload);

      if (!response.success) {
        return c.json?.(response, 404);
      }

      return c.json?.(response, 200);
    } catch {
      return c.json?.(
        {
          success: false,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async getDevices(c: AppContext) {
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

      const data = await iotService.getDevices();
      return c.json?.(
        {
          status: 200,
          message: 'ok',
          data,
        },
        200,
      );
    } catch {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async getDeviceDetail(c: AppContext) {
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

      const { token } = c.params as { token: string };
      const data = await iotService.getDeviceDetail(token);

      if (!data) {
        return c.json?.(
          {
            status: 404,
            message: 'Device not registered',
          },
          404,
        );
      }

      return c.json?.(
        {
          status: 200,
          message: 'ok',
          data,
        },
        200,
      );
    } catch {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async getDeviceFoods(c: AppContext) {
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

      const { token } = c.params as { token: string };
      const response = await iotService.getDeviceFoods(token);

      if (!response.success) {
        return c.json?.(response, 404);
      }

      return c.json?.(
        {
          status: 200,
          message: 'ok',
          data: response.data,
        },
        200,
      );
    } catch {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async registerDevice(c: AppContext) {
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

      const payload = c.body as IotRegisterRequest;
      const response = await iotService.registerDevice(payload);

      return c.json?.(
        {
          status: 200,
          message: 'ok',
          data: response.data,
        },
        200,
      );
    } catch {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async updateDevice(c: AppContext) {
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

      const { token } = c.params as { token: string };
      const payload = c.body as IotUpdateRequest;
      const response = await iotService.updateDevice(token, payload);

      if (!response.success) {
        return c.json?.(response, 404);
      }

      return c.json?.(
        {
          status: 200,
          message: 'ok',
          data: response.data,
        },
        200,
      );
    } catch {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }

  public async deleteDevice(c: AppContext) {
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

      const { token } = c.params as { token: string };
      const response = await iotService.deleteDevice(token);

      if (!response.success) {
        return c.json?.(response, 404);
      }

      return c.json?.(
        {
          status: 200,
          message: 'ok',
        },
        200,
      );
    } catch {
      return c.json?.(
        {
          status: 500,
          message: 'server internal error',
        },
        500,
      );
    }
  }
}

export default new IotController();
