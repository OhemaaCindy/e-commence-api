"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: parseInt(process.env.PORT || "4000", 10),
    databaseUrl: process.env.DATABASE_URL || "",
    jwtSecret: process.env.JWT_SECRET || "change_me",
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
        API_KEY: process.env.CLOUDINARY_API_KEY || "",
        API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
    },
};
if (!exports.env.databaseUrl) {
    // eslint-disable-next-line no-console
    console.error("❌ DATABASE_URL not set. Set it in a .env file at project root.");
}
//# sourceMappingURL=env.js.map