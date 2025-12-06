import { AppContext } from "@/contex/appContex";
import { JwtPayload } from "@/types/auth.types";
import { PickChilID, PickCreateChild } from "@/types/child.types";
import { redis } from "@/utils/redis";
import prisma from "prisma/client";

class ChildController {
  public async getChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 400,
            message: "user not found",
          },
          400
        );
      }
      const cacheKey = `child:${jwtUser.id}`;
      const cacheChild = await redis.get(cacheKey);

      if (cacheChild) {
        return c.json?.(
          {
            status: 200,
            message: " successfully get cache for child",
            data: cacheChild,
          },
          200
        );
      }

      const child = await prisma.child.findMany({
        where: {
          parentId: jwtUser.id,
        },
      });
      await redis.set(cacheKey, JSON.stringify(child), { EX: 60 });

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
            message: "successfully get child",
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
  public async getChildByID(c: AppContext) {
    try {
      const chilParams = c.params as PickChilID;
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      if (!chilParams) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      const cacheKey = `child:${chilParams.id}`;

      const cacheChild = await redis.get(cacheKey);

      if (cacheChild) {
        return c.json?.(
          {
            status: 200,
            message: "successfully get cache child",
            data: JSON.parse(cacheChild),
          },
          200
        );
      }
      const child = await prisma.child.findUnique({
        where: {
          id: chilParams.id,
          parentId: jwtUser.id,
        },
      });
      await redis.set(cacheKey, JSON.stringify(child), { EX: 60 });

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
            message: "successfully get child",
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
  //   initial setup
  //   public async createChild(c: AppContext) {
  //     try {
  //       const jwtUser = c.user as JwtPayload;
  //       const childBody = c.body as PickCreateChild;
  //       if (!jwtUser) {
  //         return c.json?.(
  //           {
  //             status: 404,
  //             message: "user not found",
  //           },
  //           404
  //         );
  //       }
  //       if (
  //         !childBody.dateOfBirth ||
  //         !childBody.fullname ||
  //         !childBody.gender ||
  //         !childBody.photoUrl ||
  //         !childBody.profileChild
  //       ) {
  //         return c.json?.(
  //           {
  //             status: 400,
  //             message: "body is required",
  //           },
  //           400
  //         );
  //       }

  //       const child = await prisma.child.create({
  //         data: {
  //           fullName: childBody.fullname,
  //           dateOfBirth: childBody.dateOfBirth,
  //           gender: childBody.gender,
  //           parentId:jwtUser.id

  //         },
  //       });
  //     } catch (error) {
  //       console.error(error);
  //       return c.json?.(
  //         {
  //           status: 500,
  //           message: "server internal error",
  //           error: error instanceof Error ? error.message : error,
  //         },
  //         500
  //       );
  //     }
  //   }
}

export default new ChildController();
