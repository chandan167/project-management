import { NextFunction, Request, RequestHandler, Response } from "express";

let request:Request;
let response: Response;
let nextFunction: NextFunction

export const setExpressGlobalObject: RequestHandler =  (req:Request, res:Response, next:NextFunction) =>{
    request = req;
    response = res;
    nextFunction = next;
    next();
}

export function getRequest():Request{
    return request;
}

export function getResponse():Response{
    return response;
}

export function getNextFunction():NextFunction{
    return nextFunction;
}