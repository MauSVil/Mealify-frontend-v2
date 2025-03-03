import { useEffect } from "react";
import { getSocket } from "../lib/socket";

interface SocketHandler {
  (data: unknown): void;
}

const useSocket = (event: string, handler: SocketHandler) => {
  useEffect(() => {
    const socket = getSocket().socket;

    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
};

export default useSocket;