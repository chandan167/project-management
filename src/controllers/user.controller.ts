import { NextFunction, Request, RequestHandler, Response } from "express";
import { IUser } from "../models/user";
import * as UserService from '../services/user.service';
import { apiResponse } from "../utils/api-response";

export const getUsers: RequestHandler = async (_req:Request, _res: Response, _next:NextFunction) =>{
    const user = await UserService.getUsers();
    return apiResponse().setData({user:user}).toJson();
}


export const createUsers: RequestHandler = async (req:Request, _res: Response, _next:NextFunction) =>{
    const {firstName, lastName, email, password}:IUser = req.body;
    const user = await UserService.createUser({firstName, lastName, email, password});
    return apiResponse().setData({user:user}).toJson();
}