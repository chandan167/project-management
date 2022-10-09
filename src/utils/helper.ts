import { NextFunction, Request, RequestHandler, Response } from "express";


export const asyncResolver = (fun:RequestHandler) => (req:Request, res:Response, next:NextFunction) => Promise.resolve(fun(req, res, next)).catch(next);