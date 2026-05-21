import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Optional: Filter by store_id
    socket.on("join_store", (store_id: string) => {
      socket.join(`store_${store_id}`);
      console.log(`Socket ${socket.id} joined store ${store_id}`);
    });

    socket.on("leave_store", (store_id: string) => {
      socket.leave(`store_${store_id}`);
      console.log(`Socket ${socket.id} left store ${store_id}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};
