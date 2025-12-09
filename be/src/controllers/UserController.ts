import prisma from "prisma/client";
import {
  JwtPayload,
  PickID,
  PickUpdatePassword,
  PickUpdateProfile,
} from "@/types/auth.types";
import { AppContext } from "@/contex/appContex";
import { uploadCloudinary } from "@/utils/clodinary";
import bcrypt from "bcryptjs";
import { redis } from "@/utils/redis";
import { PickChilID } from "@/types/child.types";
import { cacheKeys } from "@/cache/cacheKey";
class UserController {
  public async getProfile(c: AppContext) {
    try {
      const user = c.user as JwtPayload;

      if (!user) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }

      const cacheKey = cacheKeys.user.profile(user.id);

      const cacheProfile = await redis.get(cacheKey);

      if (cacheProfile) {
        return c.json?.(
          {
            status: 200,
            message: "successfully get cache profile",
            data: JSON.parse(cacheProfile),
          },
          200
        );
      }
      const auth = await prisma.user.findFirst({
        where: {
          id: user.id,
        },
      });

      await redis.set(cacheKey, JSON.stringify(auth), { EX: 60 });
      return c.json?.(
        {
          status: 200,
          message: "succes get user",
          data: auth,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "Server Internal Error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async editProfile(c: AppContext) {
    try {
      const user = c.body as PickUpdateProfile;
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
      let documentUrl: { photoUrl: string } = { photoUrl: "" };
      if (c.files?.photoUrl?.[0]) {
        const file = c.files.photoUrl[0];
        const buffer = file.buffer;

        const result = await uploadCloudinary(
          buffer,
          "photoUrl",
          file.originalname
        );
        documentUrl.photoUrl = result.secure_url;
      } else if (
        user.photoUrl &&
        typeof user.photoUrl === "string" &&
        user.photoUrl.startsWith("data:image")
      ) {
        const base64 = user.photoUrl;
        const buffer = Buffer.from(base64.split(",")[1], "base64");

        const result = await uploadCloudinary(buffer, "photoUrl", "image.png");
        documentUrl.photoUrl = result.secure_url;
      }
      const Auth = await prisma.user.update({
        where: {
          id: jwtUser.id,
        },
        data: {
          fullName: user.fullName,
          email: user.email,
          photoUrl: documentUrl.photoUrl,
          phone: user.phone,
        },
      });
      const cacheKey = cacheKeys.user.profile(jwtUser.id);
      await redis.del(cacheKey);
      return c.json?.(
        {
          status: 201,
          message: "succes update profile",
          data: Auth,
        },
        201
      );
    } catch (error) {
      console.error(error);
      return c.json?.(
        {
          status: 500,
          message: "Server Internal Error",
          error: error instanceof Error ? error.message : error,
        },
        500
      );
    }
  }
  public async deleteAccount(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          40
        );
      }
      const auth = await prisma.user.delete({
        where: {
          id: jwtUser.id,
        },
      });
      const cacheKey = cacheKeys.user.byID(jwtUser.id);
      await redis.del(cacheKey);
      if (!auth) {
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
            message: "successfully delete acound",
            data: auth,
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
  public async updatePassword(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const usr = c.body as PickUpdatePassword;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      if (!usr) {
        return c.json?.(
          {
            status: 400,
            message: "body is required",
          },
          400
        );
      }

      const hashPassword = await bcrypt.hash(usr.password, 10);

      const user = await prisma.user.update({
        where: {
          id: jwtUser.id,
        },
        data: {
          password: hashPassword,
        },
      });

      if (!user) {
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
            message: "successfully update password",
            data: user,
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
  public async getParent(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;

      if (!jwtUser) {
        return c.json?.({ status: 400, message: "user not found" }, 400);
      }

      const cacheKey = cacheKeys.parent.list();
      const cacheUser = await redis.get(cacheKey);

      if (cacheUser) {
        return c.json?.(
          {
            status: 200,
            message: "successfully data from cache",
            data: JSON.parse(cacheUser),
          },
          200
        );
      }

      const user = await prisma.user.findMany({
        where: { role: "PARENT" },
      });

      if (!user) {
        return c.json?.({ status: 400, message: "server internal error" }, 400);
      }

      await redis.set(cacheKey, JSON.stringify(user), { EX: 60 });

      return c.json?.(
        {
          status: 200,
          message: "successfully get user",
          data: user,
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
  public async getUserByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const userID = c.params as PickID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      if (!userID) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      const cacheKey = cacheKeys.user.byID(userID.id);
      const cacheUser = await redis.get(cacheKey);

      if (cacheUser) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get cache redis",
            data: JSON.parse(cacheUser),
          },
          200
        );
      }
      const auth = await prisma.user.findUnique({
        where: {
          id: userID.id,
        },
      });

      await redis.set(cacheKey, JSON.stringify(auth), { EX: 60 });
      if (!auth) {
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
            message: "succesfully get user id",
            data: auth,
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
  public async AllReadyLogin(c: AppContext) {
    try {
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
      const session = await prisma.userSession.findFirst({
        where: {
          userId: jwtUser.id,
          expiresAt: { gt: new Date() },
        },
      });
      if (!session) {
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
            message: "user sedang login",
            data: session,
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
  public async getKader(c: AppContext) {
    try {
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
      const cacheKey = cacheKeys.kader.list();
      const cacheKader = await redis.get(cacheKey);
      if (cacheKader) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get kader by cache",
            data: JSON.parse(cacheKader),
          },
          200
        );
      }
      const user = await prisma.user.findMany({
        where: {
          role: "KADER",
        },
      });
      await redis.set(cacheKey, JSON.stringify(user), { EX: 60 });
      if (!user) {
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
            message: "succesfully get kader",
            data: user,
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
  public async getKaderByID(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const userID = c.params as PickID;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 404,
            message: "user not found",
          },
          404
        );
      }
      if (!userID) {
        return c.json?.(
          {
            status: 400,
            message: "params is required",
          },
          400
        );
      }
      const cacheKey = cacheKeys.kader.byID(userID.id);
      const cacheKaderID = await redis.get(cacheKey);
      if (cacheKaderID) {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get Kader by Cache",
            data: JSON.parse(cacheKaderID),
          },
          200
        );
      }

      const kader = await prisma.user.findUnique({
        where: {
          id: userID.id,
          role: "KADER",
        },
      });

      await redis.set(cacheKey, JSON.stringify(kader), { EX: 60 });

      if (!kader) {
        return c.json?.(
          {
            status: 400,
            message: "server internal error",
          },
          400
        );
      } else if (kader.role !== "KADER") {
        return c.json?.(
          {
            status: 403,
            messsage: "role mismatch",
          },
          403
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: "succesfully get kader by id",
            data: kader,
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
      const cacheKey = cacheKeys.child.list();
      const cacheChild = await redis.get(cacheKey);

      if (cacheChild) {
        return c.json?.(
          {
            status: 200,
            message: " successfully get cache for child",
            data: JSON.parse(cacheChild),
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
      const cacheKey = cacheKeys.child.byParent(jwtUser.id);

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
      const parent = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
          role: "PARENT",
        },
      });

      if (!parent || parent.role !== "PARENT") {
        return c.json?.(
          {
            status: 400,
            message: "parent not found + parent not role",
          },
          400
        );
      }
      const child = await prisma.child.findFirst({
        where: {
          id: chilParams.id,
          parentId: parent.id,
        },
      });

      await redis.set(cacheKey, JSON.stringify(child), { EX: 60 });
      if (!child) {
        return c.json?.(
          {
            status: 404,
            message: "server internal error",
          },
          404
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
}

export default new UserController();
