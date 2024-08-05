import mongoose from "mongoose";
import { IComment, Comment } from "../models/comment";
import logger from "../logs/config";

export default class CommentService {
  // Method to create a new comment
  static async createComment(comment: IComment) {
    try {
      const commentObj = new Comment(comment);
      return await commentObj.save();
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to get all comments
  static async getAllComments() {
    try {
      const comments = await Comment.find();
      return comments;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to get a comment by ID
  static async getCommentById(id: string) {
    try {
      const comment = await Comment.findById(id);
      return comment;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to get a comment by blog ID
  static async getCommentByBlogId(blogId: string): Promise<Comment[] | null> {
    try {
      const comments: Comment[] | null = await Comment.find({
        blog: new mongoose.Types.ObjectId(blogId),
      }).populate({ path: "author", select: "username profile" });
      return comments;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // method to get user comments on a blog
  static async getCommentByBlogIdAndUserId(blogId: string, userId: string) {
    try {
      const blogComments = await Comment.find({ blog: blogId, author: userId });
      return blogComments;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to update a comment by ID
  static async updateCommentById(id: string, updatedComment: IComment) {
    try {
      const comment = await Comment.findByIdAndUpdate(id, updatedComment, {
        new: true,
      });
      return comment;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to delete a comment by ID
  static async deleteCommentById(id: string) {
    try {
      const comment = await Comment.findByIdAndDelete(id);
      return comment;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }
}
