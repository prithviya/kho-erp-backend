const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

let io;
const userSockets = new Map();

function readCookie(cookieHeader, name) {
    const value = cookieHeader?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
    return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
}

function initializeSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token
                || readCookie(socket.handshake.headers.cookie, "erp_access_token");
            if (!token) return next(new Error("Unauthorized"));
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = Number(decoded.id);
            if (!socket.userId) return next(new Error("Unauthorized"));
            next();
        } catch {
            next(new Error("Unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.userId;
        const sockets = userSockets.get(userId) || new Set();
        sockets.add(socket.id);
        userSockets.set(userId, sockets);

        socket.on("disconnect", () => {
            const active = userSockets.get(userId);
            active?.delete(socket.id);
            if (!active?.size) userSockets.delete(userId);
        });
    });

    return io;
}

function emitToUser(userId, event, payload) {
    if (!io) return;
    for (const socketId of userSockets.get(Number(userId)) || []) {
        io.to(socketId).emit(event, payload);
    }
}

module.exports = { initializeSocket, emitToUser };
