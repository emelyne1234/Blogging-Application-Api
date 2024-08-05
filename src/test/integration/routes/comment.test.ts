import request from "supertest";
import { Comment } from "../../../models/comment";
import { User, generateAuthToken } from "../../../models/user";
import { Blog } from "../../../models/blog";
import { Server } from "http";

let server: Server;
describe("/api/comments", () => {
  beforeEach(() => {
    server = require("../../../server");
  });

  afterEach(async () => {
    server.close();
    await Comment.deleteMany({});
    await User.deleteMany({});
    await Blog.deleteMany({});
  });

  describe("POST /api/blogs/:blogId/comments", () => {
    it("Should return a 400 if invalid inputs are provided", async () => {
      const res = await request(server)
        .post("/api/blogs/123/comments")
        .send({ author: "", content: "test comment" });
      expect(res.status).toBe(400);
    });

    it("Should return a 201 if valid inputs are provided", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      });
      await user.save();
      const blog = new Blog({
        title: "Test Blog",
        content: "This is a test blog",
        author: user._id,
      });
      await blog.save();

      const token = generateAuthToken(user._id);
      const res = await request(server)
        .post(`/api/blogs/${blog._id}/comments`)
        .set("x-auth-token", token)
        .send({ author: user._id, content: "test comment" });
      expect(res.status).toBe(201);
      expect(res.body.createdComment.author).toBe(user._id.toString());
    });
  });

  describe("GET /api/blogs/:blogId/comments", () => {
    it("Should return a 400 if invalid blog ID is provided", async () => {
      const res = await request(server).get("/api/blogs/123/comments");
      expect(res.status).toBe(400);
    });

    it("Should return a 200 if valid blog ID is provided", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      });
      await user.save();
      const blog = new Blog({
        title: "Test Blog",
        content: "This is a test blog",
        author: user._id,
      });
      await blog.save();

      const res = await request(server).get(`/api/blogs/${blog._id}/comments`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/blogs/:blogId/comments/:commentId", () => {
    it("Should return a 400 if invalid blog ID or comment ID is provided", async () => {
      const res = await request(server).get("/api/blogs/123/comments/456");
      expect(res.status).toBe(400);
    });

    it("Should return a 200 if valid blog ID and comment ID is provided", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      });
      await user.save();
      const blog = new Blog({
        title: "Test Blog",
        content: "This is a test blog",
        author: user._id,
      });
      await blog.save();
      const comment = new Comment({
        author: user._id,
        content: "test comment",
        blog: blog._id,
      });
      await comment.save();

      const res = await request(server).get(
        `/api/blogs/${blog._id}/comments/${comment._id}`
      );
      expect(res.status).toBe(200);
      expect(res.body.author).toBe(user._id.toString());
    });
  });

  describe("PUT /api/blogs/:blogId/comments/:commentId", () => {
    it("Should return a 400 if invalid blog ID or comment ID is provided", async () => {
      const res = await request(server).put("/api/blogs/123/comments/456");
      expect(res.status).toBe(400);
    });

    it("Should return a 400 if invalid inputs are provided", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      });
      await user.save();
      const blog = new Blog({
        title: "Test Blog",
        content: "This is a test blog",
        author: user._id,
      });
      await blog.save();
      const comment = new Comment({
        author: user._id,
        content: "test comment",
        blog: blog._id,
      });
      await comment.save();

      const res = await request(server)
        .put(`/api/blogs/${blog._id}/comments/${comment._id}`)
        .send({ author: "", content: "updated comment" });
      expect(res.status).toBe(400);
    });

    it("Should return a 200 if valid inputs are provided", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      });
      await user.save();
      const blog = new Blog({
        title: "Test Blog",
        content: "This is a test blog",
        author: user._id,
      });
      await blog.save();
      const comment = new Comment({
        author: user._id,
        content: "test comment",
        blog: blog._id,
      });
      await comment.save();

      const res = await request(server)
        .put(`/api/blogs/${blog._id}/comments/${comment._id}`)
        .send({ author: user._id, content: "updated comment" });
      expect(res.status).toBe(200);
      expect(res.body.content).toBe("updated comment");
    });
  });

  describe("DELETE /api/blogs/:blogId/comments/:commentId", () => {
    it("Should return a 400 if invalid blog ID or comment ID is provided", async () => {
      const res = await request(server).delete("/api/blogs/123/comments/456");
      expect(res.status).toBe(400);
    });

    it("Should return a 200 if valid inputs are provided", async () => {
      const user = new User({
        username: "testuser",
        email: "testuser@example.com",
        password: "testpassword",
      });
      await user.save();
      const blog = new Blog({
        title: "Test Blog",
        content: "This is a test blog",
        author: user._id,
      });
      await blog.save();
      const comment = new Comment({
        author: user._id,
        content: "test comment",
        blog: blog._id,
      });
      await comment.save();

      const res = await request(server).delete(
        `/api/blogs/${blog._id}/comments/${comment._id}`
      );
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(comment._id.toString());
    });
  });
});
