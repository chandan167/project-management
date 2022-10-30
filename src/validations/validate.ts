import { NextFunction, Request, RequestHandler, Response } from "express";
import { matchedData, ValidationChain, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { asyncResolver } from "../utils/helper";


const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return error.msg
    },
});


const validate: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = myValidationResult(req);
    if (!errors.isEmpty()) {
        return res.apiResponse.setStatusCode(StatusCodes.UNPROCESSABLE_ENTITY).setMessage('Validation error').setData({
            error: errors.mapped()
        }).toJson();
    }
    req.query = matchedData(req, { locations: ['query'] });
    req.body = matchedData(req, { locations: ['body'] });
    next();
}

export const validateSchema = (schema: ValidationChain[]) => {
    return [...schema, asyncResolver(validate)]
}