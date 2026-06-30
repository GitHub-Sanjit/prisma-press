import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

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

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    //   ||req.headers.authorization?.startsWith("Bearer ")
    //     ? req.headers.authorization?.split(" ")[1]
    //     : req.headers.authorization;
    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to Access this resources",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { email, name, id, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resources",
      );
    }

    const user = await prisma.user.findUnique({
      where: { id, email, name, role },
    });

    if (!user) {
      throw new Error("User now found. Please login Again");
    }

    if (user.activeStatus === "BLOCKED") {
      throw new Error("Your Account has been blocked. Please Contact Support");
    }

    req.user = { email, name, id, role };

    next();
  });
};

router.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.getMyProfile,
);

export const userRoutes = router;
