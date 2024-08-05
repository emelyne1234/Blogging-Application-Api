import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export default function validateObjectId(req:Request, res:Response, next:NextFunction){
    if(mongoose.isValidObjectId(req.params.id)){
        next();
    }else{
        res.status(404).send("Not found");
    }
}