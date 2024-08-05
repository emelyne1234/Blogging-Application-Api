import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from  'dotenv';
import { IUser } from '../models/user';

dotenv.config();
const secretKey = process.env.SECRET_KEY as string;

// Extending the Request interface to include a user property
declare global {
    namespace Express {
        interface Request {
            user?: IUser['_id']; 
        }
    }
}

function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: "No Token Provided" });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey) as { id: IUser['_id'] };
        req.user = decoded.id;
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ msg: "Invalid Token" });
    }

   
}

export default auth;
