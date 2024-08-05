import request from "supertest";
import { User, generateAuthToken } from "../../../models/user";
import { IncomingMessage, Server, ServerResponse } from "http";

let server: Server;
describe("api/users", () => {
  beforeEach(() => {
    server = require("../../../server");
  });

  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });
  // testing Get end point
  describe("GET /", () => {
    it("should return 401 if the user is unauthorized or not authenticated", async () => {
      const res = await request(server).get("/api/users");
      expect(res.status).toBe(401);
    });
    it("should return a list of users (200) if the authenticated user is authorized", async () => {
      const users = await User.insertMany([
        {
          username: "Munezero",
          email: "munezero@gmail.com",
          password: "Mune@123",
          role: "admin",
        },
        {
          username: "Mune",
          email: "mune@gmail.com",
          password: "Mune@123",
          role: "reader",
        },
      ]);
      const token = generateAuthToken(users[0]._id);
      const res = await request(server)
        .get("/api/users")
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
    });
  });

  //  Testing Get '/:id' route handler
  describe("GET /:id", () => {
    it("should returns 404 when the id is invalid", async () => {
      const user = new User({
        username: "Munezero",
        email: "munezero@gmail.com",
        password: "Mune@123",
        role: "admin",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .get("/api/users/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });
    it("should return the user object with the given id", async () => {
      const user = new User({
        username: "Munezero",
        email: "munezero@gmail.com",
        password: "Mune@123",
        role: "admin",
      });
      await user.save();
      const res = await request(server).get("/api/users/" + user._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", user.email);
    });
  });

  // testing users update end points
  describe("PUT /:id", () => {
    it("should return 400 if the user id is missing", async () => {
      const user = new User({
        username: "test",
        email: "test",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .put("/api/users/1")
        .set("x-auth-token", token)
        .send({
          username: "test",
          email: "test",
          password: "password@123",
          role: "admin",
        });
      expect(res.status).toBe(400);
    });

    it("should return 400 if the user id is invalid or not a valid mongoose id", async () => {
      const user = new User({
        username: "test",
        email: "test",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .put("/api/users/:1")
        .set("x-auth-token", token)
        .send({
          username: "test username",
          email: "test@gmail.com",
          password: "password@123",
          role: "reader",
        });
      expect(res.status).toBe(400);
    });

    // it("should return 400 if data provided are invalid", async () => {
    //   const user = new User({ username: "test", email: 'test', password: 'password@123', role: "reader" });
    //   await user.save();
    //   const token = generateAuthToken(user._id);
    //   const res = await request(server).put('/api/users/' + user._id)
    //     .set('x-auth-token', token)
    //     .send({ username: "test", email: 'test', password: 'password@123', role: "admin" });
    //   expect(res.status).toBe(400);
    // });

    it("should return 404 if the user does not exist", async () => {
      const user = new User({
        username: "test",
        email: "test",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .put("/api/users/609e9c5c9e192d0015c37495")
        .set("x-auth-token", token)
        .send({
          username: "test username",
          email: "test@gmail.com",
          password: "password@123",
          role: "reader",
        });
      expect(res.status).toBe(404);
    });

    it("should update user info and return updated user object with 200 status code", async () => {
      const user = new User({
        username: "test",
        email: "test",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);

      const updatedData = {
        username: "updated username",
        email: "updated@test.com",
        password: "updatedpassword@123",
        role: "admin",
      };
      const res = await request(server)
        .put("/api/users/" + user._id)
        .set("x-auth-token", token)
        .send(updatedData);

      expect(res.status).toBe(200);
    });
  });

  // Delete test for user
  describe("DELETE /:id", () => {
    it("should return 400 if the user id is missing", async () => {
      const user = new User({
        username: "test",
        email: "test@test.com",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .delete("/api/users/1")
        .set("x-auth-token", token);
      expect(res.status).toBe(400);
    });

    it("should return 404 if the user does not exist", async () => {
      const user = new User({
        username: "test",
        email: "test@test.com",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .delete("/api/users/609e9c5c9e192d0015c37495")
        .set("x-auth-token", token);
      expect(res.status).toBe(404);
    });

    it("should delete the user and return 200 if successful", async () => {
      const user = new User({
        username: "test",
        email: "test@test.com",
        password: "password@123",
        role: "reader",
      });
      await user.save();
      const token = generateAuthToken(user._id);
      const res = await request(server)
        .delete("/api/users/" + user._id)
        .set("x-auth-token", token);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User had been deleted successfully");
    });
  });
});
