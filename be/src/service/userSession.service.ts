import prisma from 'prisma/client';

class UserSesionService {
  public async getHisryLogin(jwtId: string) {
    try {
      const historyLogin = await prisma.userSession.findMany({
        where: {
          userId: jwtId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      return historyLogin;
    } catch (error) {
      throw new Error(`failed get history ${error}`);
    }
  }

  public async getCurrentSession(jwtId: string) {
    try {
      const session = await prisma.userSession.findFirst({
        where: {
          userId: jwtId,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      return session;
    } catch (error) {
      throw new Error(`failed get current session ${error}`);
    }
  }
}

export default new UserSesionService();
