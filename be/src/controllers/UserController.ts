import prisma from "prisma/client";
import {
  JwtPayload,
  PickUpdatePassword,
  PickUpdateProfile,
} from "@/types/auth.types";
import { AppContext } from "@/contex/appContex";
import { uploadCloudinary } from "@/utils/clodinary";
import bcrypt from "bcryptjs";
import { redis } from "@/utils/redis";

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

      const cacheKey = `profile${user.id}`;

      const cacheProfile = await redis.get(cacheKey);

      if (cacheProfile) {
        return c.json?.({
          status: 200,
          message: "successfully get cache profile",
          data: JSON.parse(cacheProfile),
        });
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
      const cacheKey = `user:${jwtUser.id}`;
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
      const cacheKey = `user:${jwtUser.id}`;
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

      const cacheKey = `user:${jwtUser.id}`;
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
        where: { id: jwtUser.id },
        select: { role: jwtUser.role === "PARENT" },
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
}

export default new UserController();
