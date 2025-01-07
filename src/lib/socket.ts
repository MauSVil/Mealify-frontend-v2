import { io } from "socket.io-client";

import { Socket } from "socket.io-client";

let socket: Socket | undefined;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
    });
  }
  return socket;
};
