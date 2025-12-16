import app from "@/app";

export const initSocket = () => {
  app.ws("/ws", {
    open(ws) {
      console.log(`ws connect: ${ws}`);
    },
    message(ws, message: unknown) {
      const data = JSON.parse(message as string);
      if (data.type === "join") ws.subscribe(`user:${data.userId}`);
    },
  });
};
