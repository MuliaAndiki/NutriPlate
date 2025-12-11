import { cacheKeys } from "@/cache/cacheKey";
import { AppContext } from "@/contex/appContex";
import { JwtPayload } from "@/types/auth.types";
import { PickChilID, PickCreateChild } from "@/types/child.types";
import { PickPosyanduID } from "@/types/posyandu.types";
import { redis } from "@/utils/redis";
import prisma from "prisma/client";

class ChildController {
  public async createChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childBody = c.body as PickCreateChild;
      const posyanduID = c.params as PickPosyanduID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      if (
        !childBody.dateOfBirth ||
        !childBody.fullname ||
        !childBody.gender ||
        !childBody.photoUrl
      ) {
        return c.json?.(
          {
            status: 400,
            message: "body is required",
          },
          400
        );
      }

      if (!posyanduID) {
        return c.json?.(
          {
            status: 400,
            message: "posyandu not found",
          },
          400
        );
      }

      const child = await prisma.child.create({
        data: {
          fullName: childBody.fullname,
          dateOfBirth: childBody.dateOfBirth,
          gender: childBody.gender,
          parentId: jwtUser.id,
          posyanduId: posyanduID.id,
          profileChild: typeof childBody.profileChild,
        },
      });
      if (!child) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: "succesfully create Child",
            data: child,
          },
          200
        );
      }
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async updateChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childID = c.params as PickChilID;
      const childBody = c.body as PickCreateChild;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 400,
            message: "user not found",
          },
          400
        );
      }
      if (!childID) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }

      const child = await prisma.child.update({
        where: {
          id: childID.id,
          parentId: jwtUser.id,
        },
        data: {
          fullName: childBody.fullname,
          dateOfBirth: childBody.dateOfBirth,
          gender: childBody.gender,
          parentId: jwtUser.id,
          profileChild: typeof childBody.profileChild,
        },
      });

      const cacheKey = cacheKeys.child.byParent(jwtUser.id);
      if (!child) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      }
      await redis.del(cacheKey);
      return c.json?.(
        {
          status: 200,
          message: "succesfully update child",
          data: child,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async deleteChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childID = c.params as PickChilID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          400
        );
      }
      if (!childID) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      const cacheKey = cacheKeys.child.byParent(jwtUser.id);
      const child = await prisma.child.delete({
        where: {
          id: childID.id,
          parentId: jwtUser.id,
        },
      });
      await redis.del(cacheKey);
      if (!child) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      }
      return c.json?.(
        {
          status: 200,
          message: "succesfully delete child",
          data: child,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "server internal error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
}

export default new ChildController();
