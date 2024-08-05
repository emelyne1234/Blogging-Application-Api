import express, { Request, Response } from "express";
import { validateUserObject, IUser } from "../models/user";
import bcrypt from "bcrypt";
import UserService from "../services/userService";
import mongoose from "mongoose";
import cloudinary from "../cloudinary.config";
import { logger } from "../logs/config";

export default class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users: IUser[] | null = await UserService.getAllUsers();

      if (!users) {
        res.status(404).send("No users found");
        return;
      }
      res.status(200).send({ usersCount: users.length, users: users });
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async registerUser(req: Request, res: Response) {
    try {
      const { error } = validateUserObject(req.body);
      if (error) {
        res.status(400).send(error.details[0].message); // Return error message if validation fails
        return;
      }
      const profile = req.file?.path ?? "defaultProfile.png";
      const { username, email, password, role } = req.body;
      // check if email has been used
      const theUser = await UserService.findUserByEmail(email);
      if (theUser) {
        res.status(400).send({ message: "Email has been taken" });
        return;
      }
      // save the user to the database
      const user: IUser | null = await UserService.createUser(
        username,
        email,
        password,
        role,
        profile
      );
      if (!user) {
        res.status(400).send({ message: "Account not created" });
        return;
      }

      // Send the created user object back
      res
        .status(201)
        .send({ message: "Account created successfully", createdUser: user });
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (!id || !mongoose.isValidObjectId(id)) {
        res.status(400).send("an user id is required");
        return;
      }

      const user = await UserService.findUserById(id);
      if (!user) {
        res.status(404).send("user not found");
        return;
      }
      res.status(200).send(user);
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async updateUserInfo(req: Request, res: Response) {
    const { id } = req.params;
    try {
      if (!id || !mongoose.isValidObjectId(id)) {
        res.status(400).send("A valid user id is required");
        return;
      }

      let profile = "defaultProfile";

      if (req.file) {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        profile = uploadResult.secure_url || "defaultProfile";
      }

      const { username, email, password, role } = req.body;
      let hashedPassword = "";
      if (password) {
        hashedPassword = await bcrypt.hash(password, 12);
      }
      const theUser: IUser = {
        username,
        email,
        password: hashedPassword,
        role,
        profile,
      };

      const updatedUser = await UserService.findUserByIdAndUpdate(id, theUser);
      if (!updatedUser) {
        res.status(404).send("User not found");
        return;
      }
      res.status(200).send(updatedUser);
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }

  static async deleteUserInfo(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // checking if the id is given
      if (!id || !mongoose.isValidObjectId(id)) {
        res.status(400).send("a user id is required");
        return;
      }
      // Deleting the user from the database
      const deletedUser = await UserService.findUserByIdAndDelete(id);
      if (!deletedUser) {
        res.status(404).send("user not found");
        return;
      }
      res.status(200).send({
        message: "User had been deleted successfully",
        data: deletedUser,
      });
    } catch (e) {
      logger.error((e as Error).message);
      res.status(500).send("Internal server error");
    }
  }
}
