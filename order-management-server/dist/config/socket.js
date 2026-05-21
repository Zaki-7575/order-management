"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        },
    });
    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        // Optional: Filter by store_id
        socket.on("join_store", (store_id) => {
            socket.join(`store_${store_id}`);
            console.log(`Socket ${socket.id} joined store ${store_id}`);
        });
        socket.on("leave_store", (store_id) => {
            socket.leave(`store_${store_id}`);
            console.log(`Socket ${socket.id} left store ${store_id}`);
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map