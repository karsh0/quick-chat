import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
require('dotenv').config()

export function userMiddleware(req: Request,res: Response,next: NextFunction){
    const token = req.headers["token"];
    if(!token){
        console.log("token not found")
        return;
    }
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || "");
    if((decoded as JwtPayload).username){
        req.username = (decoded as JwtPayload).username
        return next()
    }
    console.log("failed in middleware")
    return;
}