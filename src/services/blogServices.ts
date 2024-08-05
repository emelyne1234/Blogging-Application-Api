import { UpdateQuery } from "mongoose";
import { IBlog, Blog } from "../models/blog";
import logger from "../logs/config";

export default class BlogService {
  // Method to create a new blog post
  static async createBlog(
    title: string,
    content: string,
    author: string,
    category?: string,
    status?: string,
    thumbnail?: string
  ) {
    try {
      if (!title || !content || !author) {
        throw new Error("Invalid blog data");
      }
      const blog = new Blog({
        title,
        content,
        author,
        category,
        status,
        thumbnail,
      });
      return await blog.save();
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to get all blog posts
  static async getAllBlogs() {
    try {
      const blogs = await Blog.find()
        .populate({ path: "author", select: "profile username email" })
        .sort({ updatedAt: 1 });
      return blogs;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to get a blog post by ID
  static async getBlogById(id: string) {
    try {
      const blog = await Blog.findById(id).populate({
        path: "author",
        select: "profile username email",
      });
      return blog;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to update a blog post by ID
  static async updateBlogById(
    id: string,
    updatedBlog: IBlog | UpdateQuery<IBlog> | undefined
  ) {
    try {
      const blog = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });
      return blog;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }

  // Method to delete a blog post by ID
  static async deleteBlogById(id: string) {
    try {
      const blog = await Blog.findByIdAndDelete(id);
      return blog;
    } catch (e) {
      logger.error((e as Error).message);
      return null;
    }
  }
}
