import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "../const/defaults";

export async function validateUser(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const token = authorization?.split('Bearer ')[1];
    if (!token) {
        res.status(401).json({ error: 'Missing auth token'});
        return;
    }
    const user = verify(token, JWT_SECRET) as { userId: string};
    req.app.set('userId', user.userId);
    next();
}