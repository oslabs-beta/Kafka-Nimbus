"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var env_mjs_1 = require("~/env.mjs");
var globalForPrisma = globalThis;
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: env_mjs_1.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (env_mjs_1.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
