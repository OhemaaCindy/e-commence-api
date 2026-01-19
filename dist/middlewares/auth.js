"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jwt_1 = require("../utils/jwt");
// export interface AuthRequest extends Request {
//   user?: { id: string; role: "USER" | "ADMIN" };
// }
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : undefined;
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = { id: payload.userId, role: payload.role };
        console.log("🚀 ~ authenticate ~ req.user:", req.user);
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
function authorize(roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (!roles.includes(req.user.role))
            return res.status(403).json({
                message: "Forbidden - Your are not authorized to access this resource",
            });
        next();
    };
}
//# sourceMappingURL=auth.js.map