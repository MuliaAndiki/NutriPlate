import { getCookie } from "cookies-next";

let socket: WebSocket | null = null;

export const connectSocket = () => {
  const token = getCookie(process.env.NEXT_PUBLIC_APP_SESSION_KEY!);

  if (!token) return;

  if (socket && socket.readyState === WebSocket.OPEN) return socket;

  socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

  socket.onopen = () => {
    socket?.send(
      JSON.stringify({
        type: "auth",
        token,
      }),
    );
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    window.dispatchEvent(new CustomEvent("ws:event", { detail: data }));
  };

  socket.onclose = () => {
    socket = null;
  };

  return socket;
};

export const disconnectSocket = () => {
  socket?.close();
  socket = null;
};
