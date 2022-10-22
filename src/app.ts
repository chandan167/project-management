import express, { Application, NextFunction, Request, Response } from 'express';
import './config/database';
import morgan from 'morgan';
import cors from 'cors';
import { NotFound, HttpError } from 'http-errors';
import { environment } from './config/environment';
import { setExpressGlobalObject } from './utils/express-object';
import { apiResponse } from './utils/api-response';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { routes } from './routes';
import { userBearerToken } from './utils/bearer-token';
import { IUserDocument } from './models/user';
import { userPagination } from './utils/helper';
import { PaginationI } from './interfaces/paginationI';



declare global {
    interface Auth {
        user: IUserDocument | null
    }
    namespace Express {
        export interface Request {
            authToken?: string;
            auth: Auth,
            pagination: PaginationI<any>| Record<string,any>,
        }
    }
}

export const app: Application = express();

app.use(express.json()).use(express.urlencoded({ extended: true }))
    .use(morgan('dev')).use(cors()).use(setExpressGlobalObject).use(userBearerToken()).use(userPagination());


app.use('/api', routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
    next(new NotFound('Route not found'))
})

app.use((error: any, _req: Request, _res: Response, _next: NextFunction) => {
    if (error instanceof HttpError) {
        return apiResponse().setStatusCode(error.status).setMessage(error.message).toJson();
    }

    if (environment.node_env == 'production') {
        return apiResponse().setStatusCode(StatusCodes.INTERNAL_SERVER_ERROR).setMessage('Something went wrong!').toJson();
    }

    return apiResponse().setStatusCode(error.status || StatusCodes.INTERNAL_SERVER_ERROR)
        .setMessage(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR)
        .setData({ stack: error.stack }).toJson()
})