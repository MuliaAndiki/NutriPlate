import { AppContext } from '@/contex/appContex';
import { JwtPayload } from '@/types/auth.types';
import { PickChilID, PickCreateChild, PickRegisteredChild } from '@/types/child.types';
import { PickPosyanduID } from '@/types/posyandu.types';
import { uploadCloudinary } from '@/utils/clodinary';
import { ParseUpdateData } from '@/utils/parseUpdateData';
import { Prisma } from '@prisma/client';
import prisma from 'prisma/client';

class ChildController {
  public async createChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childBody = c.body as PickCreateChild;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (
        !childBody.dateOfBirth ||
        !childBody.fullName ||
        !childBody.gender ||
        !childBody.placeOfBirth
      ) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }

      let documentUrl: { avaChild: string } = { avaChild: '' };
      if (c.files?.avaChild?.[0]) {
        const file = c.files.avaChild[0];
        const buffer = file.buffer;

        const result = await uploadCloudinary(buffer, 'avaChild', file.originalname);
        documentUrl.avaChild = result.secure_url;
      } else if (
        childBody.avaChild &&
        typeof childBody.avaChild === 'string' &&
        childBody.avaChild.startsWith('data:image')
      ) {
        const base64 = childBody.avaChild;
        const buffer = Buffer.from(base64.split(',')[1], 'base64');
        const result = await uploadCloudinary(buffer, 'avaChild', 'image.png');
        documentUrl.avaChild = result.secure_url;
      }

      const child = await prisma.child.create({
        data: {
          fullName: childBody.fullName,
          dateOfBirth: new Date(childBody.dateOfBirth),
          gender: childBody.gender,
          parentId: jwtUser.id,
          placeOfBirth: childBody.placeOfBirth,
          avaChild: documentUrl.avaChild ?? null,
          profileChild: childBody.profileChild as Prisma.JsonObject,
        },
      });
      if (!child) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
        return c.json?.(
          {
            status: 200,
            message: 'succesfully create Child',
            data: child,
          },
          200,
        );
      }
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
  public async updateChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childID = c.params as PickChilID;
      const childBody = c.body as PickCreateChild;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!childID) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      const parent = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });

      if (!parent || parent.role !== 'PARENT') {
        return c.json?.(
          {
            status: 404,
            message: 'role not valid',
          },
          404,
        );
      }

      let documentUrl: { avaChild: string } = { avaChild: '' };
      if (c.files?.avaChild?.[0]) {
        const file = c.files.avaChild[0];
        const buffer = file.buffer;

        const result = await uploadCloudinary(buffer, 'avaChild', file.originalname);
        documentUrl.avaChild = result.secure_url;
      } else if (
        childBody.avaChild &&
        typeof childBody.avaChild === 'string' &&
        childBody.avaChild.startsWith('data:image')
      ) {
        const base64 = childBody.avaChild;
        const buffer = Buffer.from(base64.split(',')[1], 'base64');
        const result = await uploadCloudinary(buffer, 'avaChild', 'image.png');
        documentUrl.avaChild = result.secure_url;
      }

      if (childBody.dateOfBirth) {
        const parsed = new Date(childBody.dateOfBirth);
        if (isNaN(parsed.getTime())) {
          return c.json?.(
            {
              status: 400,
              message: 'Invalid dateOfBirth format',
            },
            400,
          );
        }
      }
      const update = ParseUpdateData(childBody, {
        profileChild: (value) => value as Prisma.InputJsonObject,
        dateOfBirth: (value) => new Date(value),
      });

      const child = await prisma.child.update({
        where: {
          id: childID.id,
          parentId: parent.id,
        },
        data: update,
      });
      if (!child) {
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
          message: 'succesfully update child',
          data: child,
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
  public async deleteChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childID = c.params as PickChilID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }
      if (!childID) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }
      const parent = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });
      if (!parent || parent.role !== 'PARENT') {
        return c.json?.(
          {
            status: 403,
            message: 'server internal error & role not acces',
          },
          403,
        );
      }
      const child = await prisma.child.delete({
        where: {
          id: childID.id,
          parentId: parent.id,
        },
      });
      if (!child) {
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
          message: 'succesfully delete child',
          data: child,
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
  public async registerChild(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const childParams = c.params as PickChilID;
      const registedBody = c.body as PickRegisteredChild;

      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!childParams) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      if (!registedBody.posyanduID) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }

      const parent = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });

      if (!parent || parent.role !== 'PARENT') {
        return c.json?.(
          {
            status: 403,
            message: 'providen acces',
          },
          403,
        );
      }

      const child = await prisma.child.findFirst({
        where: {
          id: childParams.id,
          parentId: parent.id,
        },
        select: {
          id: true,
        },
      });
      if (!child) {
        return c.json?.(
          {
            status: 404,
            message: 'child not found',
          },
          404,
        );
      }

      const posyandu = await prisma.posyandu.findFirst({
        where: {
          id: registedBody.posyanduID,
        },
      });

      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'posyandu not found',
          },
          404,
        );
      }

      const registerd = await prisma.child.update({
        where: {
          id: child.id,
        },
        data: {
          posyanduId: registedBody.posyanduID,
        },
      });

      if (!registerd) {
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
          message: 'succesfully registerd child in posyandu',
          data: registerd,
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

  public async cancelRegister(c: AppContext) {
    try {
      const jwtUser = c.user as JwtPayload;
      const params = c.params as PickPosyanduID;
      const body = c.body as PickChilID;
      if (!jwtUser) {
        return c.json?.(
          {
            status: 401,
            message: 'Unauthorized',
          },
          401,
        );
      }

      if (!params) {
        return c.json?.(
          {
            status: 400,
            message: 'params is required',
          },
          400,
        );
      }

      if (!body.id) {
        return c.json?.(
          {
            status: 400,
            message: 'body is required',
          },
          400,
        );
      }

      const user = await prisma.user.findFirst({
        where: {
          id: jwtUser.id,
        },
        select: {
          role: true,
          id: true,
        },
      });
      if (!user || user.role !== 'PARENT') {
        return c.json?.(
          {
            status: 403,
            message: 'request error & acces no coret',
          },
          403,
        );
      }
      const child = await prisma.child.findFirst({
        where: {
          parentId: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!child) {
        return c.json?.(
          {
            status: 404,
            message: 'child not found',
          },
          404,
        );
      }
      const posyandu = await prisma.posyandu.findFirst({
        where: {
          id: params.id,
        },
        select: {
          id: true,
        },
      });
      if (!posyandu) {
        return c.json?.(
          {
            status: 404,
            message: 'posyandu not found',
          },
          404,
        );
      }

      const cancel = await prisma.child.update({
        where: {
          id: child.id,
        },
        data: {
          posyanduId: null,
        },
      });

      if (!cancel) {
        return c.json?.(
          {
            status: 400,
            message: 'server internal error',
          },
          400,
        );
      } else {
      }

      return c.json?.(
        {
          status: 200,
          message: 'succesfully cancel cancel',
          data: cancel,
        },
        200,
      );
    } catch (error) {
      console.error(error);
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

export default new ChildController();
