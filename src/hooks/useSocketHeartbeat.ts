import { useEffect } from "react";
import { getSocket } from "../lib/socket";

const useSocketHeartbeat = () => {
  useEffect(() => {
    const socket = getSocket();
    const interval = setInterval(() => {
      if (socket.connected) {
        socket.emit("heartbeat");
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);
};

export default useSocketHeartbeat;