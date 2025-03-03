import { io } from "socket.io-client";
import { Socket } from "socket.io-client";

let socket: Socket | undefined;
let isSocketConnected = false;

export const getSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 5000,
      timeout: 10000,
      autoConnect: true,
    });

    socket.on("connect", () => {
      isSocketConnected = true;
      console.log("✅ Socket conectado");
    });

    socket.on("disconnect", (reason) => {
      isSocketConnected = false;
      console.warn("👀 Socket desconectado:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err);
    });
  }
  return { socket, isSocketConnected };
};