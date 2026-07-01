import { prisma } from "../../lib/prisma";
import { IcreatePostPayload } from "./post.interface";

const createPost = async (payload: IcreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostById = async (postId: string) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  const updatatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return updatatedPost;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: { authorId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: { password: true },
      },

      _count: {
        select: {
          comments: true, 
        },
      },
    },
  });

  return result;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
};
