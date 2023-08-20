import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util/secrets";


const isLoggedIn = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            message: "No token provided",
        });
    } else {
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({
                message: "No token provided",
            });
        } else {
            jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
                if (err) {
                    res.status(401).json({
                        message: "Invalid token",
                    });
                } else {
                    next();
                }
            });
        }
    }
} 
export default isLoggedIn;