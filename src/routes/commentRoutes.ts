import express from "express";

import auth from "../middlewares/auth";

import CommentController from "../controllers/commentController";

const router = express.Router();

// Route for creating a new comment on a specific blog
router.post("/", auth, CommentController.createComment);

// Route for getting all comments on a specific blog
router.get('/:blogId', CommentController.getBlogComments);

// Route for getting a comment by ID on a specific blog
router.get('/:blogId/:commentId', auth, CommentController.getBlogCommentById);

// Route for updating a comment by ID on a specific blog
router.put('/:blogId/:commentId', auth, CommentController.updateBlogComment);

// Route for deleting a comment by ID on a specific blog
router.delete('/:blogId/:commentId', auth, CommentController.deleteBlogComment);

export default router;
