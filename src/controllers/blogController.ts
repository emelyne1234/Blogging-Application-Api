import { Request, Response } from "express";
import { validateBlogObject, IBlog } from "../models/blog";
import BlogService from "../services/blogServices";
import cloudinary from "../cloudinary.config";
import logger from "../logs/config";

export default class BlogController {
  static async gettAllBogs(req: Request, res: Response) {
    try {
      const blogs: IBlog[] | null = await BlogService.getAllBlogs();
      res.status(200).send({ blogsCount: blogs!.length, blogs: blogs });
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async getBlog(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const blog = await BlogService.getBlogById(id);
      if (!blog) {
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).send(blog);
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async createBlog(req: Request, res: Response): Promise<void> {
    try {
      const { error } = validateBlogObject(req.body);

      if (error) {
        res.status(400).send(error.details[0].message); // Return error message if validation fails
        return;
      }

      const uploadResult = await cloudinary.uploader.upload(req.file!.path!);

      const thumbnail = uploadResult.secure_url ?? "default";
      const { title, content, author, category, status } = req.body;

      // Save the blog to the database
      const blog: IBlog | null = await BlogService.createBlog(
        title,
        content,
        author,
        category,
        status,
        thumbnail
      );
      if (!blog) {
        res.status(400).send({ message: "Blog not created" });
        return;
      }

      // Send the created blog object back
      res
        .status(201)
        .send({ message: "Blog created successfully", createdBlog: blog });
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal Server Error");
    }
  }

  static async updateBlog(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).send("A blog ID is required");
        return;
      }

      let thumbnail;

      if (req.file && req.file.path) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        thumbnail = uploadResult.secure_url;
      } else {
        const existingBlog = await BlogService.getBlogById(id);
        if (existingBlog) {
          thumbnail = existingBlog.thumbnail;
        } else {
          res.status(404).send("Blog not found");
          return;
        }
      }

      const { title, content, author, category, status } = req.body;
      const updatedBlog: IBlog = {
        title,
        content,
        author,
        category,
        status,
        thumbnail,
      };

      const updatedBlogResult = await BlogService.updateBlogById(
        id,
        updatedBlog
      );
      if (!updatedBlogResult) {
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).send(updatedBlogResult);
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async updateBlogLikes(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).send("A blog ID is required");
        return;
      }

      const { likes } = req.body;
      const updatedBlog = { likes };

      const updatedBlogResult = await BlogService.updateBlogById(
        id,
        updatedBlog
      );
      if (!updatedBlogResult) {
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).send(updatedBlogResult);
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async deleteBlog(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (!id) {
        res.status(400).send("A blog ID is required");
        return;
      }

      const deletedBlog = await BlogService.deleteBlogById(id);
      if (!deletedBlog) {
        res.status(404).send("Blog not found");
        return;
      }
      res.status(200).send({
        message: "Blog has been deleted successfully",
        data: deletedBlog,
      });
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }
}
