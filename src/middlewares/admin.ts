import { NextFunction, Request, Response } from "express";
import UserService from "../services/userService";

async function admin(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await UserService.findUserById(req.user!);
        if (user && user.role === 'admin') {
            next();
        } else {
            return res.status(401).send("Access denied");
        }
    } catch (error) {
        console.error("Error in admin middleware:", error);
        return res.status(500).send("Internal Server Error");
    }
}
export default admin;