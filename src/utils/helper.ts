import { NextFunction, Request, RequestHandler, Response } from "express";


export const asyncResolver = (fun:RequestHandler) => (req:Request, res:Response, next:NextFunction) => Promise.resolve(fun(req, res, next)).catch(next);

export  function userPagination(limit:number = 20): RequestHandler{
    return (req:Request, _res:Response, next:NextFunction) =>{
        req.pagination = {
            limit: (req.query.limit || limit) as number,
            page: (req.query.page || 1) as number,
            search: req.query.search || null,
            orderKey: req.query.orderKey ||'createdAt',
            orderValue: req.query.orderValue || -1,
        }
        next();
    }
}