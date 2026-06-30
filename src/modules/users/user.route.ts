import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.registerUser);

router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.cookies;
    const verifiedToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret,
    );
    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    const { email, name, id, role } = verifiedToken;

    const requiredRoles = [Role.ADMIN, Role.AUTHOR, Role.USER];

    if (!requiredRoles.includes(role)) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden. You don't have permission to access this resource",
      });
    }

    req.user = { email, name, id, role };

    next();
  },
  userController.getMyProfile,
);

export const userRoutes = router;
