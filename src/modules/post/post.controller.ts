import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.user?.id;

  const payload = req.body;

  const result = await postService.createPost(payload, id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Post Created Successfully",
    data: result,
  });
};

const getAllPosts = async (req: Request, res: Response) => {
  const result = await postService.getAllPosts();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Retrived Successfully",
    data: result,
  });
};

const getPostsStats = async (req: Request, res: Response) => {};

const getMyPosts = async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  const result = await postService.getMyPosts(authorId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "MyPosts Retrived Successfully",
    data: result,
  });
};

const getPostById = async (req: Request, res: Response) => {
  const { postId } = req.params;
  if (!postId) {
    throw new Error("Post Id Required In Params ");
  }

  const result = await postService.getPostById(postId as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post Retrived Successfully",
    data: result,
  });
};

const updatePost = async (req: Request, res: Response) => {};

const deletePost = async (req: Request, res: Response) => {};

export const postController = {
  createPost,
  getAllPosts,
  getPostsStats,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
