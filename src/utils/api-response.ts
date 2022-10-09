import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getResponse } from "./express-object";

class ApiResponse{
    private status:number;
    private message:string|null;
    private data:Record<string, any>

    constructor(){
        this.message = null;
        this.data = {};
        this.status = StatusCodes.OK;
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
        const res: Response = getResponse();
        return res.status(this.status).json({
            status: this.status,
            message: this.message,
            ...this.data
        })
    }
}


export const apiResponse = () => {
    return new ApiResponse()
}