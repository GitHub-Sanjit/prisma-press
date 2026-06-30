import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userServices.userRegisterIntoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statusCode: httpStatus.CREATED,
//       message: "User Register Successfully",
//       data: { user },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to Register",
//       error: (error as Error).message,
//     });
//   }
// };

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userServices.userRegisterIntoDB(payload);
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statusCode: httpStatus.CREATED,
    //   message: "User Register Successfully",
    //   data: { user },
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Register Successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await userServices.getMyProfileFromDB(
      req.user?.id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Fetched Successfully",
      data: { profile },
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userServices.updateMyProfileInDB(
      userId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Profile Updated Successfully",
      data: { updatedProfile },
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
