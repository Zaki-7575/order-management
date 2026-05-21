import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = (storeId?: string) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      socket = io(url, {
        reconnection: true,
      });
    }

    const onConnect = () => {
      setIsConnected(true);
      if (storeId) {
        socket?.emit("join_store", storeId);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      if (storeId) {
        socket?.emit("leave_store", storeId);
      }
    };
  }, [storeId]);

  return { socket, isConnected };
};
