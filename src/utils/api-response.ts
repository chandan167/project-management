import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getResponse } from "./express-object";

export class ApiResponse{
    private status:number;
    private message:string|null;
    private data:Record<string, any>
    private res:Response;

    constructor(res:Response){
        this.message = null;
        this.data = {};
        this.status = StatusCodes.OK;
        this.res =res;
    }

    setStatusCode(status: number):this{
        this.status = status;
        return this;
    }

    setMessage(message:string):this{
        this.message = message;
        return this
    }

    setData(data:Record<string, any>):this{
        this.data = data;
        return this;
    }

    toJson(){
        return this.res.status(this.status).json({
            status: this.status,
            message: this.message,
            ...this.data
        })
    }
}

export function useApiResponse (_req: Request, res:Response, next:NextFunction){
    res.apiResponse = new ApiResponse(res);
    next();
}

