import { AppContext } from "@/contex/appContex";
import { JwtPayload } from "@/types/auth.types";
import { PickCreateChild } from "@/types/child.types";
import prisma from "prisma/client";

class ChildController {
  //   initial setup
  public async createChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childBody = c.body as PickCreateChild;
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
        !childBody.photoUrl ||
        !childBody.profileChild
      ) {
        return c.json?.(
          {
            status: 400,
            message: "body is required",
          },
          400
        );
      }
      const posyandu = await prisma.posyandu.findFirst({
        where: {
          userID: jwtUser.id,
        },
      });
      if (!posyandu) {
        return c.json?.({
          status: 400,
          message: "posyandu not found",
        });
      }

      const child = await prisma.child.create({
        data: {
          fullName: childBody.fullname,
          dateOfBirth: childBody.dateOfBirth,
          gender: childBody.gender,
          parentId: jwtUser.id,
          posyanduId: posyandu.id,
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
}

export default new ChildController();
