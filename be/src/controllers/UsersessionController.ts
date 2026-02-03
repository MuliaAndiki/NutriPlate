import { AppContext } from '@/contex/appContex';
import userSessionService from '@/service/userSession.service';
import { JwtPayload } from '@/types/auth.types';

class UserSessionControler {
  public async getUserSession(c: AppContext) {
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
      const history = await userSessionService.getHisryLogin(jwtUser.id);
      if (!history) {
        return c.json?.(
          {
            status: 400,
            message: 'failed get history session',
          },
          400,
        );
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get history session',
          data: history,
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

  public async getCurrentSession(c: AppContext) {
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
      const session = await userSessionService.getCurrentSession(jwtUser.id);
      if (!session) {
        return c.json?.(
          {
            status: 404,
            message: 'session not found',
          },
          404,
        );
      }
      return c.json?.(
        {
          status: 200,
          message: 'succesfully get current session',
          data: session,
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

export default new UserSessionControler();
