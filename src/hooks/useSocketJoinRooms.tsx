import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAdmin } from "@/app/(public)/onboarding/(steps)/general/_hooks/useAdmin";

const useSocketJoinRooms = () => {
  const { getAminQuery } = useAdmin();

  useEffect(() => {
    if (!getAminQuery.data?.id) return;

    const socket = getSocket().socket;

    const connectHandler = () => {
      console.log('Socket connected. Joining rooms...');

      if (getAminQuery.data?.id) {
        console.log("Socket connected. Joining room:", `admin_${getAminQuery.data.id}`);
        socket.emit("message", { type: "joinRoom", roomId: `admin_${getAminQuery.data.id}` });

        for (const business of getAminQuery.data.restaurants) {
          console.log("Socket connected. Joining room:", `business_${business.id}`);
          socket.emit("message", { type: "joinRoom", roomId: `business_${business.id}` });
        }
      }
    };

    const disconnectHandler = () => {
      console.log("Socket disconnected. Leaving rooms...");
    };

    socket.on("connect", connectHandler);
    socket.on("disconnect", disconnectHandler);

    return () => {
      socket.off("connect", connectHandler);
      socket.off("disconnect", disconnectHandler);
    };
  }, [getAminQuery.data]);

};

export default useSocketJoinRooms;