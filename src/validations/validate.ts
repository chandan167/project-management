import { NextFunction, Request, RequestHandler, Response } from "express";
import { matchedData, ValidationChain, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "../utils/api-response";
import { asyncResolver } from "../utils/helper";


const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return error.msg
    },
});


const validate: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return apiResponse().setStatusCode(StatusCodes.UNPROCESSABLE_ENTITY).setMessage('Validation error').setData({
            error: errors.mapped()
        }).toJson();
    }
    req.query = matchedData(req, { locations: ['query'] });
    req.body = matchedData(req, { locations: ['body'] });
    req.params = matchedData(req, { locations: ['params'] });
    next();
}

export const validateSchema = (schema: ValidationChain[]) => {
    return [...schema, asyncResolver(validate)]
}