import express from "express";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";
import BlogController from "../controllers/blogController";
import upload from "../middlewares/upload";

const router = express.Router();

// Route for getting all blogs
router.get('/',  BlogController.gettAllBogs)

// Route for getting a blog by ID
router.get('/:id', BlogController.getBlog)

// Route for creating a new blog
router.post("/", [auth, admin, upload.single("thumbnail")], BlogController.createBlog);

router.put('/:id', [auth, admin,  upload.single("thumbnail")], BlogController.updateBlog)
router.put('/:id/likes', [auth], BlogController.updateBlogLikes);

// a route to delete blogs
router.delete('/:id', [auth, admin], BlogController.deleteBlog)

export default router;
