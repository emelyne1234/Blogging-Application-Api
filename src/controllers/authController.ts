import { IUser, validateSignIn, generateAuthToken } from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserService from "../services/userService";

export default class AuthController {
  static async login(req: Request, res: Response) {
    const { error } = validateSignIn(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // finding user by email
    const { email, password } = req.body;
    const user: IUser | null = await UserService.findUserByEmail(email);
    if (!user) return res.status(400).send("Invalid email");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid password");

    const token = generateAuthToken(user._id!);
    res.header("Access-Control-Expose-Headers", "x-auth-token");
    res
      .header("x-auth-token", token)
      .send({
        _id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      });
  }
}
