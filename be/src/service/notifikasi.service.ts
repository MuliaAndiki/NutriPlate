import prisma from 'prisma/client';
import app from '@/app';
import { NotifType } from '@prisma/client';

interface CreateNotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: NotifType;
  isBroadcast?: boolean;
}

export class NotificationService {
  static async notify(payload: CreateNotificationPayload) {
    const notification = await prisma.notifications.create({
      data: {
        userId: payload.userId,
        title: payload.title,
        message: payload.message,
        type: payload.type,
        isBroadcast: payload.isBroadcast ?? false,
      },
    });

    app.server?.publish(
      `user:${payload.userId}`,
      JSON.stringify({
        type: 'notification:new',
        payload: notification,
      }),
    );

    return notification;
  }

  static async broadcastFromDraft(senderId: string, notifId: string) {
    const notif = await prisma.notifications.findUnique({
      where: { id: notifId },
    });

    if (!notif || notif.isBroadcast) {
      throw new Error('invalid notification');
    }

    const updated = await prisma.notifications.update({
      where: { id: notifId },
      data: { isBroadcast: true },
    });

    app.server?.publish(
      `user:${senderId}`,
      JSON.stringify({
        type: 'notification:broadcast',
        payload: updated,
      }),
    );

    return updated;
  }
}
