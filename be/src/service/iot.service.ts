import prisma from 'prisma/client';
import { IotStatus, Prisma } from '@prisma/client';
import type {
  IotCommandExecutedRequest,
  IotCommandPayload,
  IotRegisterRequest,
  IotSendCommandRequest,
  IotStatusRequest,
  IotUpdateRequest,
} from '@/types/iot.types';

class IotService {
  public async receiveStatus(payload: IotStatusRequest) {
    try {
      const device = await prisma.iotDevice.findUnique({
        where: { deviceToken: payload.token },
      });

      if (!device) {
        return {
          success: false,
          error: 'Device not registered',
          needRegister: true,
        };
      }

      const pendingCommand = device.command as IotCommandPayload | null;
      const commandType = pendingCommand?.type ?? null;

      await prisma.iotDevice.update({
        where: { deviceToken: payload.token },
        data: {
          lastWeight: payload.weight,
          lastStableWeight: payload.stable_weight ?? null,
          lastStatus: payload.status,
          lastOnline: new Date(),
          status: IotStatus.online,
          command: Prisma.JsonNull,
        },
      });

      return {
        success: true,
        command: commandType,
      };
    } catch (error) {
      console.error('Error in receiveStatus:', error);
      return {
        success: false,
        error: 'server internal error',
      };
    }
  }

  public async commandExecuted(payload: IotCommandExecutedRequest) {
    const device = await prisma.iotDevice.findUnique({
      where: { deviceToken: payload.token },
    });

    if (!device) {
      return {
        success: false,
        error: 'Device not registered',
      };
    }

    await prisma.iotDevice.update({
      where: { deviceToken: payload.token },
      data: {
        lastOnline: new Date(),
        status: IotStatus.online,
      },
    });

    console.log(
      `✅ Command ${payload.command} executed on ${payload.token} with status ${payload.status}`,
    );

    return {
      success: true,
    };
  }

  public async sendCommand(payload: IotSendCommandRequest) {
    const device = await prisma.iotDevice.findUnique({
      where: { deviceToken: payload.token },
    });

    if (!device) {
      return {
        success: false,
        message: 'Device not registered',
      };
    }

    const command: IotCommandPayload = {
      type: payload.command,
      sent: false,
      createdAt: new Date().toISOString(),
    };

    await prisma.iotDevice.update({
      where: { deviceToken: payload.token },
      data: {
        command: command as unknown as Prisma.InputJsonValue,
      },
    });

    return {
      success: true,
      message: `Command ${payload.command} queued for device ${payload.token}`,
    };
  }

  public async getDevices() {
    const now = Date.now();
    const devices = await prisma.iotDevice.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const offlineThresholdMs = 60_000;
    const updates = devices
      .filter((device) => {
        if (!device.lastOnline) return false;
        return now - new Date(device.lastOnline).getTime() > offlineThresholdMs;
      })
      .map((device) =>
        prisma.iotDevice.update({
          where: { id: device.id },
          data: { status: IotStatus.offline },
        }),
      );

    if (updates.length > 0) {
      await prisma.$transaction(updates);
    }

    return devices.filter((device) => {
      if (!device.lastOnline) return false;
      return now - new Date(device.lastOnline).getTime() <= offlineThresholdMs;
    });
  }

  public async getDeviceDetail(token: string) {
    return prisma.iotDevice.findUnique({
      where: { deviceToken: token },
    });
  }

  public async getDeviceFoods(token: string) {
    const device = await prisma.iotDevice.findUnique({
      where: { deviceToken: token },
    });

    if (!device) {
      return {
        success: false,
        error: 'Device not registered',
      };
    }

    const foods = await prisma.food.findMany({
      where: {
        OR: [{ iotId: device.id }, { iotId: device.deviceToken }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        child: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    return {
      success: true,
      data: foods,
    };
  }

  public async registerDevice(payload: IotRegisterRequest) {
    const device = await prisma.iotDevice.upsert({
      where: { deviceToken: payload.token },
      update: {
        deviceName: payload.name,
        pairingToken: payload.pairingToken ?? null,
        parentId: payload.parentId ?? null,
        posyanduId: payload.posyanduId ?? null,
        status: IotStatus.online,
        lastOnline: new Date(),
      },
      create: {
        deviceToken: payload.token,
        deviceName: payload.name,
        pairingToken: payload.pairingToken ?? null,
        parentId: payload.parentId ?? null,
        posyanduId: payload.posyanduId ?? null,
        status: IotStatus.online,
        lastOnline: new Date(),
      },
    });

    return {
      success: true,
      data: device,
    };
  }

  public async updateDevice(token: string, payload: IotUpdateRequest) {
    const device = await prisma.iotDevice.findUnique({
      where: { deviceToken: token },
    });

    if (!device) {
      return {
        success: false,
        error: 'Device not registered',
      };
    }

    const updated = await prisma.iotDevice.update({
      where: { deviceToken: token },
      data: {
        deviceName: payload.deviceName ?? undefined,
        parentId: payload.parentId ?? undefined,
        posyanduId: payload.posyanduId ?? undefined,
        pairingToken: payload.pairingToken ?? undefined,
        batteryLevel: payload.batteryLevel ?? undefined,
        firmwareVersion: payload.firmwareVersion ?? undefined,
        ipAddress: payload.ipAddress ?? undefined,
      },
    });

    return {
      success: true,
      data: updated,
    };
  }

  public async deleteDevice(token: string) {
    const device = await prisma.iotDevice.findUnique({
      where: { deviceToken: token },
    });

    if (!device) {
      return {
        success: false,
        error: 'Device not registered',
      };
    }

    await prisma.iotDevice.delete({
      where: { deviceToken: token },
    });

    return {
      success: true,
    };
  }
}

export default new IotService();
