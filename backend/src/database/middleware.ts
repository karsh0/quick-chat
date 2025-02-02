import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function userMiddleware(req: Request,res: Response,next: NextFunction){
    const token = req.headers["token"];
    if(!token){
        console.log("token not found")
        return;
    }
    const decoded = jwt.verify(token as string, JWT_SECRET);
    if((decoded as JwtPayload).userId){
        req.userId = (decoded as JwtPayload).userId
        return next()
    }
    console.log("failed in middleware")
    return;
}