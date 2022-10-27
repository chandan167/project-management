import { NextFunction, Request, RequestHandler, Response } from "express";
import { Unauthorized } from 'http-errors';
import * as JwtService from '../services/jwt.service';
import * as UserService from '../services/user.service';

export const authMiddleware: RequestHandler = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        if (!req.authToken) throw new Error('Auth token missing');
        const decoded:any = JwtService.verifyAuthToken(req.authToken);
        const user = await UserService.findById(decoded.payload.id);
        req.auth = {
            user: user
        };
        next();
    } catch (error: Error | any) {
        next(new Unauthorized(error.message))
    }
}