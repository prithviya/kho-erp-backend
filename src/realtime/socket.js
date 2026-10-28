const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const { User, Role, Permission } = require("../model");
const { normalizeRole } = require("../middleware/roleAccess.middleware");
const logger = require("../helpers/logger");

let io;
const userSockets = new Map();
const EVENT_PERMISSION_KEYS = {
    "task-message": ["tasks.view", "task_board.view", "task_schedule.view", "assign_board.view"],
    "task-activity": ["tasks.view", "task_board.view", "task_schedule.view", "assign_board.view"],
    "project-message": ["project_details.view", "project_onboard.view", "assign_board.view"],
    notification: [
        "tasks.view",
        "task_board.view",
        "task_schedule.view",
        "assign_board.view",
        "project_details.view",
        "project_onboard.view",
    ],
};
const frontendUrl = process.env.FRONTEND_URL || (
    process.env.NODE_ENV === "production"
        ? "https://will.khosocial.com"
        : "http://localhost:5173"
);

function readCookie(cookieHeader, name) {
    const value = cookieHeader?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
    return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
}

function hasEventPermission(user, event) {
    const requiredKeys = EVENT_PERMISSION_KEYS[event];
    if (!requiredKeys || !user?.isActive) {
        return false;
    }

    const roles = user.roles || [];
    if (roles.some((role) => (
        role.isActive !== false
        && (
            normalizeRole(role.code) === "superadmin"
            || normalizeRole(role.name) === "superadmin"
        )
    ))) {
        return true;
    }

    return roles.some((role) => (
        role.isActive !== false
        && (role.permissions || []).some((permission) => requiredKeys.includes(permission.permissionKey))
    ));
}

async function loadUserWithPermissions(userId) {
    return User.findByPk(userId, {
        include: [
            {
                model: Role,
                as: "roles",
                attributes: ["id", "name", "code", "isActive"],
                through: { attributes: [] },
                include: [
                    {
                        model: Permission,
                        as: "permissions",
                        attributes: ["permissionKey"],
                        through: { attributes: [] },
                        where: { isActive: true },
                        required: false,
                    },
                ],
            },
        ],
    });
}

function initializeSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: frontendUrl,
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token
                || readCookie(socket.handshake.headers.cookie, "erp_access_token");
            if (!token) return next(new Error("Unauthorized"));
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id, {
                attributes: ["id", "isActive"],
            });
            if (!user?.isActive) return next(new Error("Unauthorized"));
            socket.userId = Number(user.id);
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

async function emitToUser(userId, event, payload) {
    if (!io) return;
    try {
        const user = await loadUserWithPermissions(userId);
        if (!hasEventPermission(user, event)) {
            return;
        }

        for (const socketId of userSockets.get(Number(userId)) || []) {
            io.to(socketId).emit(event, payload);
        }
    } catch (error) {
        logger.error(`Socket event authorization failed for user ${userId}: ${error.message}`);
    }
}

module.exports = { initializeSocket, emitToUser, hasEventPermission };
