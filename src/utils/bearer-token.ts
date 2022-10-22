import { NextFunction, Request, RequestHandler, Response } from "express";


type BindKey = 'body' | 'headers' | 'query'
export interface UserBearerTokenOptions {
    key: BindKey;
    bind: string;
    tokenAccessKey: string;
}


const initialOption: UserBearerTokenOptions = {
    key: 'headers',
    bind: 'authorization',
    tokenAccessKey: 'authToken'
}

export function userBearerToken(option: UserBearerTokenOptions = initialOption): RequestHandler {
    const bindings: UserBearerTokenOptions = {...initialOption, ...option};

    return (req:Request|any, _res:Response, next:NextFunction) =>{
        let token: string|null = null;

        if(bindings.key == 'headers'){
            const authorization = (req.headers.authorization || '').split(" ")
            if(authorization[0] == 'Bearer' && authorization[1]){
                token = authorization[1] || null;
            }
        }else{
            token = req[bindings.key][bindings.bind]
        }
        req[bindings.tokenAccessKey] = token
        next();
    }
}