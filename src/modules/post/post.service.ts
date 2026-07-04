import { CommentStatus, PostStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IcreatePostPayload, IUpdatePostPayload } from "./post.interface";

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
    // where: {
    //   title: "My First Post",
    //   content: "Ronaldo is the best football player in the world",
    // },

    // where: {
    //   AND: [
    //     { title: "My First Post" },
    //     {
    //       contains: "Ronaldo is the best football player in the world",
    //     },
    //     {
    //       tags: {
    //         equals: ["sports", "football"],
    //       },
    //     },
    //   ],
    // },

    // where: {
    //   title: { contains: "My First Post", mode: "insensitive" },
    // },

    // where: {
    //   OR: [
    //     { title: { contains: "My First Post", mode: "insensitive" } },
    //     {
    //       content: {
    //         contains: "Ronaldo is the best football player in the world",
    //       },
    //     },
    //   ],
    // },

    // Combining Search(AND operator) and filtering(OR operator)
    // where: {
    //   AND: [
    //     {
    //       OR: [
    //         { title: { contains: "My First Post", mode: "insensitive" } },
    //         {
    //           content: {
    //             contains: "Ronaldo is the best football player in the world",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     { title: "My First Post" },
    //     { content: "Ronaldo is the best football player in the world" },
    //   ],
    // },
    take: 10,
    skip: 1, //visiting page 2
    // skip:   1, //visiting page 3
    // skip:   1, //
    // skip:   1,
    // skip:   1,

    // page = 3, limit / take = 10, skip = (page - 1) * limit = (3 - 1) * 10 = 20
    orderBy: {
      createdAt: "desc",
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

  return posts;
};

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPost = await tx.post.count();
    // const totalPublishedPost = await tx.post.count({
    //   where: { status: PostStatus.PUBLISHED },
    // });
    // const totalDraftedPost = await tx.post.count({
    //   where: { status: PostStatus.DRAFT },
    // });
    // const totalArchivedPost = await tx.post.count({
    //   where: { status: PostStatus.ARCHIVED },
    // });
    // const totalComment = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where: { status: CommentStatus.APPROVED },
    // });
    // const totalRejectedComments = await tx.comment.count({
    //   where: { status: CommentStatus.REJECTED },
    // });

    // const totalPostViewsAggregate = await tx.post.aggregate({
    //   _sum: { views: true },
    // });

    // const totalPostViews = totalPostViewsAggregate._sum.views;

    // return {
    //   totalPost,
    //   totalPublishedPost,
    //   totalDraftedPost,
    //   totalArchivedPost,
    //   totalComment,
    //   totalApprovedComments,
    //   totalRejectedComments,
    //   totalPostViews,
    // };

    const [
      totalPost,
      totalPublishedPost,
      totalDraftedPost,
      totalArchivedPost,
      totalComment,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: { status: PostStatus.PUBLISHED },
      }),
      await tx.post.count({
        where: { status: PostStatus.DRAFT },
      }),
      await tx.post.count({
        where: { status: PostStatus.ARCHIVED },
      }),
      await tx.comment.count(),
      await tx.comment.count({
        where: { status: CommentStatus.APPROVED },
      }),
      await tx.comment.count({
        where: { status: CommentStatus.REJECTED },
      }),
      await tx.post.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
      totalPost,
      totalPublishedPost,
      totalDraftedPost,
      totalArchivedPost,
      totalComment,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });

  return transactionResult;
};

const getPostById = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    // throw new Error("Fake Error")
    const post = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return post;
  });

  return transactionResult;
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

const updatePost = async (
  postId: string,
  payload: IUpdatePostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: { id: postId },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the owner of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return null;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostsStats,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
};
